import Image from 'next/image';
import styled from 'styled-components';

import { BackgroundWhite, Black, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { roadmap as roadmapImg } from '@assets/webp';

const RoadmapSection = () => {
  return (
    <Wrapper>
      <Content>
        <SectionTitle>활동 로드맵</SectionTitle>
        <ChartImageWrapper>
          <Image src={roadmapImg} alt="활동 로드맵" style={{ width: '100%', height: 'auto' }} />
        </ChartImageWrapper>
        <Caption>*일정 상 변경될 수 있습니다</Caption>
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
  margin-bottom: 93px;
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

const Caption = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;
