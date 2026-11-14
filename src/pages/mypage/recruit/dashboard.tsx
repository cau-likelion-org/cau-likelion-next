import { Fragment, ReactElement, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import TextSelect from '@common/select/TextSelect';
import Tooltip from '@common/tooltip/Tooltip';
import MyPageShell from '@mypage/component/MyPageShell';
import { APPLICANT_GENERATIONS } from '@mypage/recruit/applicantMock';
import DistributionPieChart from '@mypage/recruit/dashboard/DistributionPieChart';
import MajorRanking from '@mypage/recruit/dashboard/MajorRanking';
import ReferralBarChart from '@mypage/recruit/dashboard/ReferralBarChart';
import SubmissionTrendChart from '@mypage/recruit/dashboard/SubmissionTrendChart';
import { getRecruitDashboard } from '@mypage/recruit/dashboard/dashboardMock';
import { ENROLLMENT_STATUS_OPTIONS, GRADE_OPTIONS } from '@recruit/apply/mock';
import { IcCaretDown } from '@assets/svg';
import useRoleGuard from 'src/apis/useRoleGuard';
import { canManageRecruit } from '@utils/index';
import { DashboardCount, formatRatio } from '@utils/recruitDashboard';
import { Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const toGenerationLabel = (generation: number) => `${generation}기 모집`;

const STAGE_COLORS = [Orange.o50, Orange.o75, Orange.o100, Orange.o200];

// 원형 그래프는 선택지 순서대로 그린다
const inOptionOrder = (items: DashboardCount[], options: string[]) =>
  options.map((label) => ({ label, count: items.find((item) => item.label === label)?.count ?? 0 }));

const MyPageRecruitDashboard = () => {
  const { isAuthorized, isUserProfileError } = useRoleGuard(canManageRecruit);
  const [generation, setGeneration] = useState(APPLICANT_GENERATIONS[0]);

  // 페이지에 들어오거나 새로고침할 때마다 그 시점 기준으로 다시 집계한다
  const dashboardQuery = useQuery({
    queryKey: ['recruitDashboard', generation],
    queryFn: () => getRecruitDashboard(generation),
    enabled: isAuthorized,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  if (!isAuthorized) return <PageLoadingGate isError={isUserProfileError} />;

  const dashboard = dashboardQuery.data?.dashboard;
  // 본인 확인을 마친 사람도 없으면 접수 전으로 보고 수치 대신 '-'를 둔다
  const isEmpty = !dashboard || dashboard.identityCount === 0;
  const stages = [
    { label: '본인확인', count: dashboard?.identityCount },
    {
      label: '서류 제출',
      count: dashboard?.applicantCount,
      tooltip: `미제출 ${dashboard?.notSubmittedCount}명, 지각제출 ${dashboard?.lateCount}명`,
    },
    { label: '서류 합격', count: dashboard?.documentPassCount, tooltip: `불합격 ${dashboard?.documentFailCount}명` },
    { label: '면접 합격', count: dashboard?.finalPassCount, tooltip: `불합격 ${dashboard?.finalFailCount}명` },
  ];

  return (
    <Root>
      <TitleRow>
        <Title>리크루팅 대시보드</Title>
        <TextSelect
          ariaLabel="모집 기수"
          options={APPLICANT_GENERATIONS.map(toGenerationLabel)}
          value={toGenerationLabel(generation)}
          onChange={(label) => setGeneration(Number.parseInt(label, 10))}
        />
      </TitleRow>
      <SummaryCards>
        <SummaryCard>
          <SummaryLabel>전체 지원자</SummaryLabel>
          <SummaryValue>{dashboard?.applicantCount ?? 0}명</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>전체 경쟁률</SummaryLabel>
          <SummaryValue>{isEmpty ? '-' : formatRatio(dashboard.competitionRate)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>본인 확인 대비 제출 전환율</SummaryLabel>
          <SummaryValue>{isEmpty ? '-' : formatRatio(dashboard.conversionRatio)}</SummaryValue>
        </SummaryCard>
      </SummaryCards>
      <Section>
        <SectionTitle>단계별 인원</SectionTitle>
        <Stages>
          {stages.map((stage, index) => (
            <Fragment key={stage.label}>
              {index > 0 && <StageArrow aria-hidden width={24} height={24} />}
              <Stage $color={STAGE_COLORS[index]}>
                <StageLabel>{stage.label}</StageLabel>
                <StageValue>{isEmpty ? '-' : `${stage.count}명`}</StageValue>
                {stage.tooltip && !isEmpty && <StageTooltip position="top" align="center" text={stage.tooltip} />}
              </Stage>
            </Fragment>
          ))}
        </Stages>
      </Section>
      <Section>
        <SectionTitle>서류 제출 추이</SectionTitle>
        <SubmissionTrendChart dailySubmissions={dashboard?.dailySubmissions ?? []} isEmpty={isEmpty} />
      </Section>
      <Section>
        <SectionTitle>지원자 분포</SectionTitle>
        <Distribution>
          <MajorRanking majors={dashboard?.majors ?? []} majorsByPart={dashboard?.majorsByPart ?? {}} />
          <DistributionPieChart label="학년" items={inOptionOrder(dashboard?.grades ?? [], GRADE_OPTIONS)} />
          <DistributionPieChart
            label="학적"
            items={inOptionOrder(dashboard?.enrollmentStatuses ?? [], ENROLLMENT_STATUS_OPTIONS)}
          />
        </Distribution>
      </Section>
      <Section>
        <SectionTitle>지원 경로 분포</SectionTitle>
        <ReferralBarChart referrals={dashboard?.referrals ?? []} />
      </Section>
    </Root>
  );
};

MyPageRecruitDashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="recruit-dashboard">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageRecruitDashboard;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 38px;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title2.bold)}
`;

const SummaryCards = styled.div`
  display: flex;
  gap: 20px;
`;

const SummaryCard = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 20px;
  border-radius: 14px;
  background-color: ${Orange.o50};
  color: ${Orange.o500};
  white-space: nowrap;
`;

const SummaryLabel = styled.p`
  margin: 0;
  ${typographyCss(Typography.body1Normal.medium)}
`;

const SummaryValue = styled.p`
  margin: 0;
  ${typographyCss(Typography.title2.bold)}
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0 14px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Stages = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StageTooltip = styled(Tooltip)`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  z-index: 10;
  display: none;
  width: max-content;
  transform: translateX(-50%);
`;

const Stage = styled.div<{ $color: string }>`
  position: relative;
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 12px;
  border-radius: 14px;
  background-color: ${(props) => props.$color};
  color: ${Label.normal};
  white-space: nowrap;

  &:hover ${StageTooltip} {
    display: flex;
  }
`;

const StageLabel = styled.p`
  margin: 0;
  ${typographyCss(Typography.body1Normal.medium)}
`;

const StageValue = styled.p`
  margin: 0;
  ${typographyCss(Typography.heading1.bold)}
`;

const StageArrow = styled(IcCaretDown)`
  flex-shrink: 0;
  color: ${Label.alternative};
  transform: rotate(-90deg);
`;

const Distribution = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;
