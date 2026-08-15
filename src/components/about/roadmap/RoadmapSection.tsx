import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { getRoadmap } from 'src/apis/roadmap';
import { BackgroundWhite, Black, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const RoadmapSection = () => {
  const { data: roadmap } = useQuery({ queryKey: ['roadmap'], queryFn: () => getRoadmap() });

  return (
    <Wrapper>
      <Content>
        <SectionTitle>활동 로드맵</SectionTitle>
        <ChartImageWrapper>{roadmap && <ChartImage src={roadmap.imageUrl} alt="활동 로드맵" />}</ChartImageWrapper>
        <Caption>*상기 일정은 사정에 따라 변경될 수 있습니다</Caption>
      </Content>
    </Wrapper>
  );
};

export default RoadmapSection;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 80px 20px;
  background-color: ${BackgroundWhite.tertiary};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  width: 100%;
  max-width: 1060px;
`;

const SectionTitle = styled.p`
  margin: 0;
  width: 100%;
  text-align: center;
  color: ${Black.b900};
  ${typographyCss(Typography.display2.bold)}
`;

const ChartImageWrapper = styled.div`
  width: 100%;
`;

const ChartImage = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

const Caption = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;
