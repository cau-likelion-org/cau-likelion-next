import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { getIntroduce } from 'src/apis/introduce';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { Black, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { MOBILE } from '@home/common/responsive';

interface IStat {
  number: string;
  label: string;
}

const DESCRIPTION =
  '아이디어를 현실로 만드는 IT 창업 동아리, 중앙대학교 멋쟁이사자처럼입니다.\n기획, 디자인, 개발 파트가 함께 소통하며 우리만의 서비스를 세상에 내놓는 경험을 쌓아갑니다.';

const MOBILE_DESCRIPTION =
  '아이디어를 현실로 만드는 IT 창업 동아리, 중앙대학교 멋쟁이사자처럼입니다. 기획, 디자인, 개발 파트가 함께 소통하며 우리만의 서비스를 세상에 내놓는 경험을 쌓아갑니다.';

const IntroduceSection = () => {
  const { data: indicator, isLoading, isError } = useQuery({ queryKey: ['indicator'], queryFn: () => getIntroduce() });

  const stats: IStat[] = [
    { number: indicator?.cumulativeGenerations ?? '', label: '누적 활동 기수' },
    { number: indicator?.cumulativeGraduates ?? '', label: '누적 수료자 수' },
    { number: indicator?.cumulativeProjects ?? '', label: '누적 프로젝트 개수' },
  ];

  return (
    <Wrapper>
      <Content>
        <TextGroup>
          <Title>중앙대학교 멋쟁이사자처럼</Title>
          <DesktopDescription>{DESCRIPTION}</DesktopDescription>
          <MobileDescription>{MOBILE_DESCRIPTION}</MobileDescription>
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

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    padding: 60px 20px 80px;
  }
`;

const Content = styled.div`
  width: 1060px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    gap: 50px;
  }
`;

const TextGroup = styled.div`
  width: fit-content;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
  color: ${Black.b0};

  @media (max-width: ${MOBILE}px) {
    width: 100%;
    gap: 24px;
  }
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  width: 100%;
  margin: 0;

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.title1.bold)}
  }
`;

const Description = styled.p`
  ${typographyCss(Typography.heading2.medium)}
  width: 100%;
  white-space: pre-line;
  margin: 0;

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.label1Normal.medium)}
  }
`;

const DesktopDescription = styled(Description)`
  @media (max-width: ${MOBILE}px) {
    display: none;
  }
`;

const MobileDescription = styled(Description)`
  display: none;

  @media (max-width: ${MOBILE}px) {
    display: block;
  }
`;

const StatsGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;

  @media (max-width: ${MOBILE}px) {
    width: 217px;
  }
`;

const StatRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: ${MOBILE}px) {
    flex-direction: column;
  }
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

  @media (max-width: ${MOBILE}px) {
    flex: 0 0 auto;
    width: 100%;
    height: 130px;
    justify-content: center;
    gap: 4px;
  }
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

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.display2.bold)}
    flex: 0 0 auto;
  }
`;

const StatLabel = styled.p`
  ${typographyCss(Typography.body1Normal.medium)}
  margin: 0;
`;

const Footnote = styled.p`
  ${typographyCss(Typography.caption1.regular)}
  color: ${Orange.o100};
  margin: 0;

  @media (max-width: ${MOBILE}px) {
    ${typographyCss(Typography.caption2.regular)}
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;
`;
