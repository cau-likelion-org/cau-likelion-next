import React from 'react';
import styled from 'styled-components';
import QuestionLion from '@image/가치_물음표 사자.gif';
import Image from 'next/image';
import { Primary } from '@utils/constant/color';

const VisionSection = () => {
  return (
    <Wrapper>
      <TitleText>우리가 추구하는 가치</TitleText>
      <ValueCard>
        <DescriptionWrapper>
          <TitleWrapper>
            <BlueText>다채로운 아이디어를</BlueText>
            <BlueText>펼칠 수 있는 환경</BlueText>
          </TitleWrapper>
          <BlackText>
            아기 사자들의 다양하고 재미있는 아이디어들을 직접 실현시킬 수 있는 환경을 최우선으로 만들고 있습니다. 중앙대
            멋쟁이 사자처럼에서 즐겁게 공부하며 나의 아이디어를 직접 실현시켜 볼 수 있는 기회를 가질 수 있어요. 어쩌구
            저쩌구! 가나다라 마바사 아자차카 타파하 라고 합니다.
          </BlackText>
        </DescriptionWrapper>
        <ImageWrapper>
          <Image src={QuestionLion} width={'372px'} height={'372px'} alt="소개하는 사자" />
        </ImageWrapper>
      </ValueCard>
    </Wrapper>
  );
};

export default VisionSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  scroll-snap-align: start;
`;
const TitleWrapper = styled.div`
  margin-bottom: 44px;
`;
const TitleText = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 3.7rem;
  width: 100%;
  line-height: 76.51px;
  text-align: center;
  margin: 15px 0 70px 0;

  @media (max-width: 1200px) {
    justify-content: center;
  }
`;

const ValueCard = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DescriptionWrapper = styled.div`
  flex-basis: 66%;
  max-width: 755px;
  word-break: normal;
  overflow-y: hidden;
  text-overflow: ellipsis;
`;

const BlueText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 4rem;
  color: ${Primary.default};

  @media (max-width: 1200px) {
    display: flex;
    justify-content: center;
  }
`;

const BlackText = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.7rem;
  line-height: 182.52%;

  @media (max-width: 1200px) {
    justify-content: center;
    display: flex;
  }
`;
