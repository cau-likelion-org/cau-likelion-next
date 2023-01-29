import React from 'react';
import styled from 'styled-components';
import IntroLion from '@image/소개_인사하는 사자.gif';
import Image from 'next/image';
import PhotoCard from './component/PhotoCard';
import archiving from '@image/활동기록보러가기.png';

const IntroduceSection = () => {
  return (
    <Wrapper>
      <Image src={IntroLion} width={'180px'} height={'180px'} alt="소개하는 사자" />
      <TitleText>중앙대 멋사를 소개합니다!</TitleText>
      <SubText>중앙대학교 멋쟁이 사자처럼은 테크 기반의 아이디어를 실현하기 위해</SubText>
      <SubText>다양한 분야의 중앙인이 모였습니다.</SubText>
      <PhotoCardWrapper>
        <PhotoCard title={'정기세션 모아보기'} subtitle={'정기세션'} thumbnail={archiving.src} routing={'/session'} />
        <PhotoCard title={'활동기록 보러가기'} subtitle={'활동기록'} thumbnail={archiving.src} routing={'/gallery'} />
      </PhotoCardWrapper>
    </Wrapper>
  );
};

export default IntroduceSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PhotoCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 30px;
  margin: 50px 0;

  @media(max-width: 1200px) {
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
  font-size: 3.7rem;
  line-height: 76.51px;
  text-align: center;
  margin: 15px 0;
`;

const SubText = styled(TitleText)`
  font-size: 2.3rem;
  line-height: 40.91px;
  font-weight: 400;
  margin: 0;
`;