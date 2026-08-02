import styled from 'styled-components';

import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const AboutHero = () => {
  return (
    <Wrapper>
      <Title>중앙대학교 멋쟁이사자처럼</Title>
      <Description>
        중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한
        <br />
        중앙대 멋사 간략한 소개글 두줄 정도 중앙대 멋사 간략한 소개글 두줄 정도
      </Description>
    </Wrapper>
  );
};

export default AboutHero;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 100%;
  padding: 80px 20px;
  text-align: center;
  color: ${Orange.o500};
`;

const Title = styled.p`
  margin: 0;
  width: 100%;
  ${typographyCss(Typography.display2.bold)}
`;

const Description = styled.p`
  margin: 0;
  width: 100%;
  ${typographyCss(Typography.heading2.medium)}
`;
