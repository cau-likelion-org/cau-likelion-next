import { Primary } from '@utils/constant/color';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import styled from 'styled-components';
import { IActivityData } from '../ActivitySection';

const CircleComponent = ({ data }: { data: IActivityData }) => {
  return (
    <Wrapper>
      <ImageWrapper>
        <CustomImage src={data.image} alt="이미지" layout="fill" objectFit="cover"></CustomImage>
      </ImageWrapper>
      <TextWrapper>
        <Title>{data.title}</Title>
        <Text>{data.text}</Text>
      </TextWrapper>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 250px;
  height: 250px;
  @media (max-width: 1540px) {
    width: 180px;
    height: 180px;
  }
  @media (max-width: 900px) {
    width: 160px;
    height: 160px;
  }
  @media (max-width: 450px) {
    width: 100px;
    height: 100px;
  }

  border-radius: 50%;
  border-color: ${Primary.default};
  border-style: solid;
  border-width: 1px;
`;

const CustomImage = styled(Image)`
  border-radius: 50%;
`;
const TextWrapper = styled.div`
  width: 100%;
  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  text-align: center;
  color: #fefeff;
  @media (max-width: 500px) {
    font-size: 13px;
  }
`;
const Text = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fefeff;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Pretendard';
  margin-top: 10px;
  @media (max-width: 500px) {
    font-size: 10px;
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 230px;
  height: 230px;
  @media (max-width: 1540px) {
    width: 160px;
    height: 160px;
  }

  @media (max-width: 900px) {
    width: 140px;
    height: 140px;
  }
  @media (max-width: 450px) {
    width: 90px;
    height: 90px;
  }

  filter: brightness(50%);
  border-radius: 50%;
`;
export default CircleComponent;
