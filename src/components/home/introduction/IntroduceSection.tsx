import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { getIntroduce } from 'src/apis/introduce';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { Black, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface IStat {
  number: string;
  label: string;
}

const IntroduceSection = () => {
  const { data: indicator, isLoading, isError } = useQuery({ queryKey: ['indicator'], queryFn: () => getIntroduce() });

  const stats: IStat[] = [
    { number: indicator ? `${indicator.cumulativeGenerations}기` : '', label: '누적 활동 기수' },
    { number: indicator?.cumulativeGraduates ?? '', label: '누적 수료자 수' },
    { number: indicator?.cumulativeProjects ?? '', label: '누적 프로젝트 개수' },
  ];

  return (
    <Wrapper>
      <Content>
        <TextGroup>
          <Title>중앙대학교 멋쟁이사자처럼</Title>
          <Description>
            중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한
            <br />
            중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한 소개글 두줄 정도
          </Description>
        </TextGroup>
        {isLoading ? (
          <LoadingWrapper>
            <LinearLoading />
          </LoadingWrapper>
        ) : isError ? (
          <EmptyState variant="error" />
        ) : (
          <StatsGroup>
            <StatRow>
              {stats.map(({ number, label }) => (
                <StatCard key={label}>
                  <StatNumber>{number}</StatNumber>
                  <StatLabel>{label}</StatLabel>
                </StatCard>
              ))}
            </StatRow>
            <Footnote>*출처정보 (2026년 02월 기준)</Footnote>
          </StatsGroup>
        )}
      </Content>
    </Wrapper>
  );
};

export default IntroduceSection;

const Wrapper = styled.div`
  width: 1440px;
  padding: 60px 190px 80px 190px;
  background-color: ${Orange.o500};
  display: flex;
  justify-content: center;
  scroll-snap-align: start;
`;

const Content = styled.div`
  width: 1060px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
`;

const TextGroup = styled.div`
  width: 713px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
  color: ${Black.b0};
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  width: 100%;
  margin: 0;
`;

const Description = styled.p`
  ${typographyCss(Typography.heading2.medium)}
  width: 100%;
  margin: 0;
`;

const StatsGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
`;

const StatRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatCard = styled.div`
  flex: 1 0 0;
  min-width: 0;
  height: 200px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  background-color: ${Orange.o400};
  color: ${Black.b0};
`;

const StatNumber = styled.p`
  ${typographyCss(Typography.display1.bold)}
  flex: 1 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  margin: 0;
`;

const StatLabel = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  margin: 0;
`;

const Footnote = styled.p`
  ${typographyCss(Typography.caption1.regular)}
  color: ${Orange.o100};
  margin: 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
`;
