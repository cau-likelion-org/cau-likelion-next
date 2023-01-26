import React from 'react';
import styled from 'styled-components';
import QuestionLion from '@image/가치_물음표 사자.gif';
import Image from 'next/image';
import { PrimaryBlue } from '@utils/constant/color';


const VisionSection = () => {
    return (
        <Wrapper>
            <TitleText>우리가 추구하는 가치</TitleText>
            <ValueCard>
                <ImageWrapper>
                    <Image src={QuestionLion} width={'300px'} height={'300px'} alt="소개하는 사자" />
                </ImageWrapper>
                <DescriptionWrapper>
                    <BlueText>다채로운 아이디어를 펼칠 수 있는 환경</BlueText>
                    <BlackText>아기 사자들의 다양하고 재미있는 아이디어들을 직접 실현시킬 수 있는 환경을 최우선으로 만들고 있습니다. 중앙대 멋쟁이 사자처럼에서 즐겁게 공부하며 나의 아이디어를 직접 실현시켜 볼 수 있는 기회를 가질 수 있어요. 어쩌구 저쩌구! 가나다라 마바사 아자차카 타파하 라고 합니다.</BlackText>
                </DescriptionWrapper>
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
`;

const TitleText = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 37px;
  width: 100%;
  line-height: 76.51px;
  text-align: center;
  margin: 15px 0 70px 0;
`;

const ValueCard = styled.div`
    display: flex;
    justify-content: center;
    gap: 65px;
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
    font-weight: 700;
    font-size: 30px;
    line-height: 153.02%;
    color: ${PrimaryBlue.default};
    margin-bottom: 44px;
`;

const BlackText = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 30px;
    line-height: 182.52%;
`;