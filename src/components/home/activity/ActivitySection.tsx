import React from 'react';
import styled from 'styled-components';
import QuestionLion from '@image/가치_물음표 사자.gif';
import Image, { StaticImageData } from 'next/image';
import FadeInComponent from '@home/common/FadeInComponent';
import CircleComponent from './component/CircleComponent';
import 해커톤 from '@image/해커톤.png';
import 아이디어톤 from '@image/아이디어톤.png';
import 스터디 from '@image/스터디.png';
import 정기세션 from '@image/정기세션.png';
import 중커톤 from '@image/중커톤.png';
export interface IActivityData {
  title: string;
  text: string;
  image: StaticImageData;
}
const ActivitySection = () => {
  const data = [
    {
      title: '정기세션',
      text: '트랙별 정기 세션',
      image: 정기세션,
    },
    {
      title: '아이디어톤',
      text: '해커톤을 위한 청사진',
      image: 아이디어톤,
    },
    {
      title: '해커톤',
      text: '아이디어 실현의 장',
      image: 해커톤,
    },
    {
      title: '중커톤',
      text: '중앙대 멋사만의 해커톤',
      image: 중커톤,
    },
    {
      title: '스터디',
      text: '함께 공부하며 성장하기',
      image: 스터디,
    },
  ] as IActivityData[];
  return (
    <FadeInComponent>
      <Wrapper>
        <ImageWrapper>
          <Image src={QuestionLion} layout="fill" objectFit="fill" objectPosition="center" alt="소개하는 사자" />
        </ImageWrapper>
        <TitleText>멋사의 다양한 활동</TitleText>
        <ThreeCircleWrapper>
          {Array.from({ length: 3 }).map((_, index) => (
            <CircleComponent key={index} data={data[index]} />
          ))}
        </ThreeCircleWrapper>
        <TwoCircleWrapper>
          {Array.from({ length: 2 }).map((_, index) => (
            <CircleComponent key={index + 3} data={data[index + 3]} />
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
  line-height: 4rem;
  margin: 2.5rem 0;
  font-size: 3rem;
  @media (max-width: 900px) {
    justify-content: center;
    font-size: 2.5rem;
  }
`;
