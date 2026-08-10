import { ReactNode, useMemo } from 'react';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import { getAssignments, getUserAttendance } from 'src/apis/mypage';
import useTokenStore from 'src/store/useTokenStore';
import { getTotalScore } from '@utils/index';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TOTAL_SCORE_MAX = 3;

const MyScoreSection = ({ userProfile }: { userProfile: UserProfile }) => {
  const tokenValue = useTokenStore((state) => state.token);
  const isActiveGeneration = userProfile.role === 'BABY_LION';

  const { data: userAttendance } = useQuery({
    queryKey: ['userAttendance'],
    queryFn: () => getUserAttendance(tokenValue),
    enabled: !!tokenValue.access && isActiveGeneration,
  });

  const { data: userAssignment } = useQuery({
    queryKey: ['userAssignment'],
    queryFn: () => getAssignments().then((data) => data.filter((user: any) => user['이름'] === userProfile.name)),
    enabled: isActiveGeneration,
  });

  const totalScore = useMemo(() => {
    if (!userAttendance || !userAssignment || userAssignment.length === 0) return 0;
    return getTotalScore({
      absence: userAttendance.absence,
      truancy: userAttendance.truancy,
      tardiness: userAttendance.tardiness,
      notSubmitted: userAssignment[0]['과제 미제출'],
      lateSubmitted: userAssignment[0]['과제 지각제출'],
    });
  }, [userAssignment, userAttendance]);

  const hasAssignment = !!userAssignment && userAssignment.length > 0;

  return (
    <Section>
      <SectionTitle>상벌점내역표</SectionTitle>
      {isActiveGeneration ? (
        <CardRow>
          <StatCard title="출결">
            <StatItem label="지각" value={userAttendance?.tardiness ?? 0} />
            <StatItem label="결석" value={userAttendance?.absence ?? 0} />
            <StatItem label="무단결석" value={userAttendance?.truancy ?? 0} />
          </StatCard>
          <StatCard title="과제">
            <StatItem label="지각제출" value={hasAssignment ? userAssignment[0]['과제 지각제출'] : 0} />
            <StatItem label="미제출" value={hasAssignment ? userAssignment[0]['과제 미제출'] : 0} />
          </StatCard>
          <TotalScoreCard score={totalScore} />
        </CardRow>
      ) : (
        <EmptyCard>올해 활동 내역이 없습니다</EmptyCard>
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

const StatCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 340px;
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
