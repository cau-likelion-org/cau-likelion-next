import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import { getMyScore } from 'src/apis/mypage';
import useTokenStore from 'src/store/useTokenStore';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

const TOTAL_SCORE_MAX = 3;

const MyScoreSection = ({ userProfile }: { userProfile: UserProfile }) => {
  const tokenValue = useTokenStore((state) => state.token);
  const isActiveGeneration = userProfile.role === 'BABY_LION';

  const {
    data: score,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['myScore'],
    queryFn: () => getMyScore(tokenValue),
    enabled: !!tokenValue.access && isActiveGeneration,
  });

  return (
    <Section>
      <SectionTitle>상벌점내역표</SectionTitle>
      {!isActiveGeneration ? (
        <EmptyCard>올해 활동 내역이 없습니다</EmptyCard>
      ) : isLoading ? (
        <LoadingWrapper>
          <LinearLoading />
        </LoadingWrapper>
      ) : isError ? (
        <EmptyState variant="error" />
      ) : (
        <CardRow>
          <StatCard title="출결">
            <StatItem label="지각" value={score?.lateCount ?? 0} />
            <StatItem label="결석" value={score?.absentCount ?? 0} />
            <StatItem label="무단결석" value={score?.unauthorizedAbsentCount ?? 0} />
          </StatCard>
          <StatCard title="과제">
            <StatItem label="지각제출" value={score?.lateSubmitCount ?? 0} />
            <StatItem label="미제출" value={score?.missedCount ?? 0} />
          </StatCard>
          <TotalScoreCard score={score?.total ?? 0} />
        </CardRow>
      )}
    </Section>
  );
};

export default MyScoreSection;

const StatCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <StatCardWrapper>
    <StatCardHeader>{title}</StatCardHeader>
    <StatCardBody>{children}</StatCardBody>
  </StatCardWrapper>
);

const StatItem = ({ label, value }: { label: string; value: number }) => (
  <StatItemWrapper>
    <StatLabel>{label}</StatLabel>
    <StatValue $highlight={value > 0}>{value}회</StatValue>
  </StatItemWrapper>
);

const TotalScoreCard = ({ score }: { score: number }) => (
  <TotalCardWrapper>
    <TotalCardHeader>총점</TotalCardHeader>
    <TotalCardBody>
      <TotalScoreValue>{score}점</TotalScoreValue>
      <TotalScoreMax> / {TOTAL_SCORE_MAX}점</TotalScoreMax>
    </TotalCardBody>
  </TotalCardWrapper>
);

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
`;

const SectionTitle = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;

  @media${media.xs} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  border-radius: 12px;
  border: 1px solid ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 164px;
`;

const StatCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 340px;

  @media${media.xs} {
    width: 100%;
  }
`;

const StatCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  padding: 12px 20px;
  border: 1px solid ${Line.subtle};
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  background-color: ${BackgroundWhite.tertiary};
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.bold)}
`;

const StatCardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-top: none;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const StatItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 80px;
  text-align: center;
`;

const StatLabel = styled.p`
  margin: 0;
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const StatValue = styled.p<{ $highlight: boolean }>`
  margin: 0;
  color: ${(props) => (props.$highlight ? Orange.o500 : Label.strong)};
  ${typographyCss(Typography.title3.bold)}
`;

const TotalCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 160px;
  height: 164px;

  @media${media.xs} {
    width: 100%;
  }
`;

const TotalCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  padding: 12px 20px;
  border: 1px solid ${Orange.o100};
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  background-color: ${Orange.o75};
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.bold)}
`;

const TotalCardBody = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Orange.o100};
  border-top: none;
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  background-color: ${Orange.o50};
`;

const TotalScoreValue = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.title3.bold)}
`;

const TotalScoreMax = styled.span`
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}
`;
