import React from 'react';
import styled from 'styled-components';
import QuestionLion from '@image/가치_물음표 사자.gif';
import Image from 'next/image';
import FadeInComponent from '@home/common/FadeInComponent';
import 활동 from '@image/활동기록.png';
import CircleComponent from './component/CircleComponent';

const ActivitySection = () => {
  const titleArray = ['정기세션', '아이디어톤', '해커톤', '중커톤', '스터디'];
  const textArray = [
    '트랙별 심화 세션',
    '해커톤을 위한 청사진',
    '직접 아이디어 구현',
    '중앙대 자체 해커톤',
    '같이 공부하며 성장하기',
  ];
  return (
    <FadeInComponent>
      <Wrapper>
        <ImageWrapper>
          <Image src={QuestionLion} layout="fill" objectFit="fill" objectPosition="center" alt="소개하는 사자" />
        </ImageWrapper>
        <TitleText>멋사의 다양한 활동</TitleText>
        <ThreeCircleWrapper>
          {Array.from({ length: 3 }).map((_, index) => (
            <CircleComponent key={index} src={활동.src} title={titleArray[index]} text={textArray[index]} />
          ))}
        </ThreeCircleWrapper>
        <TwoCircleWrapper>
          {Array.from({ length: 2 }).map((_, index) => (
            <CircleComponent key={index + 3} src={활동.src} title={titleArray[index + 3]} text={textArray[index + 3]} />
          ))}
        </TwoCircleWrapper>
      </Wrapper>
    </FadeInComponent>
  );
};

export default ActivitySection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ThreeCircleWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 50px;
  @media (max-width: 400px) {
    gap: 20px;
  }
`;
const TwoCircleWrapper = styled.div`
  display: flex;
  gap: 50px;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  @media (max-width: 900px) {
    width: 80px;
    height: 80px;
  }
  @media (max-width: 1200px) {
    width: 130px;
    height: 130px;
  }
  filter: brightness(50%);
  border-radius: 50%;
`;

const TitleText = styled.div`
  display: flex;
  justify-content: flex-start;
  font-family: 'GmarketSans';
  font-style: normal;
  font-weight: 800;
  font-size: 2.7rem;
  line-height: 4rem;
  margin: 2.5rem 0;

  @media (max-width: 1550px) {
    font-size: 3rem;
  }

  @media (max-width: 900px) {
    font-size: 2.5rem;
    justify-content: center;
  }
`;
