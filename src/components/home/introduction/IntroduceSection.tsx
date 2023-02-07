import { MutableRefObject } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import PhotoCard from './component/PhotoCard';

import archiving from '@image/활동기록보러가기.png';
import IntroLion from '@image/소개_인사하는 사자.gif';
import FadeInComponent from '@home/common/FadeInComponent';
import { Variants } from 'framer-motion';

const fadeInAnimation: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 1 },
  },
  hidden: {
    opacity: 0,
    y: -100,
  },
};

const IntroduceSection = ({ innerRef }: { innerRef: MutableRefObject<null> }) => {
  return (
    <FadeInComponent variants={fadeInAnimation}>
      <Wrapper ref={innerRef}>
        <ImageWrapper>
          <Image
            src={IntroLion}
            width={'180px'}
            height={'180px'}
            layout="fill"
            objectFit="fill"
            objectPosition="center"
            alt="소개하는 사자"
          />
        </ImageWrapper>
        <TitleText>중앙대 멋사를 소개합니다!</TitleText>
        <SubText>중앙대학교 멋쟁이 사자처럼은 테크 기반의 아이디어를 실현하기 위해</SubText>
        <SubText>다양한 분야의 중앙인이 모였습니다.</SubText>
        <PhotoCardWrapper>
          <PhotoCard title={'정기세션 모아보기'} subtitle={'정기세션'} thumbnail={archiving.src} routing={'/session'} />
          <PhotoCard title={'활동기록 보러가기'} subtitle={'활동기록'} thumbnail={archiving.src} routing={'/gallery'} />
        </PhotoCardWrapper>
      </Wrapper>
    </FadeInComponent>
  );
};

export default IntroduceSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  scroll-snap-align: start;
  min-height: 100vh;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  @media (max-width: 1376px) {
    width: 100px;
    height: 100px;
  }
  @media (max-width: 1536px) {
    width: 120px;
    height: 120px;
  }
`;
const PhotoCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 30px;
  margin: 50px 0;
  @media (max-width: 1200px) {
    flex-direction: column;
    width: 500px;
  }
`;

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 3rem;
  line-height: 76.51px;
  text-align: center;
  margin: 14px 0;
  @media (max-width: 1376px) {
    font-size: 2.5rem;
    margin: 10px 0;
  }
`;

const SubText = styled(TitleText)`
  font-size: 1.7rem;
  line-height: 40.91px;
  font-weight: 400;
  margin: 0;
`;
