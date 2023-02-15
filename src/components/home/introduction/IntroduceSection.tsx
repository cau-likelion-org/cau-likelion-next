import { MutableRefObject } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import PhotoCard from './component/PhotoCard';

import archiving from '@image/활동기록.png';
import session from '@image/세션기록.png';
import IntroLion from '@image/소개_인사하는 사자.gif';
import FadeInComponent from '@home/common/FadeInComponent';

const IntroduceSection = ({ innerRef }: { innerRef: MutableRefObject<null> }) => {
  return (
    <FadeInComponent>
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
        <TitleText>중앙대학교 멋사를 소개합니다!</TitleText>
        <SubText>중앙대학교 멋쟁이사자처럼은 중앙대 학생들로 이루어진 IT 창업 동아리입니다.</SubText>
        <SubText>테크 기반의 아이디어를 실현하기 위해 기획, 디자인, 개발 트랙 간의 끊임없는 소통을 추구하며</SubText>
        <SubText>다양한 프로젝트 활동을 통해 기술적 성장을 도모하고 협업 역량을 끌어올립니다.</SubText>
        <PhotoCardWrapper>
          <PhotoCard title={'정기세션 모아보기'} subtitle={'정기세션'} thumbnail={session.src} routing={'/session'} />
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
  margin-top: 1.5rem;
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
    max-width: 500px;
  }
  @media (max-width: 900px) {
    width: 90%;
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
  text-align: center;
  margin: 14px 0;
  @media (max-width: 1376px) {
    font-size: 2.5rem;
    margin: 10px 0;
  }
`;

const SubText = styled(TitleText)`
  font-size: 1.7rem;
  font-weight: 400;
  line-height: 3rem;
  margin: 0;
`;
