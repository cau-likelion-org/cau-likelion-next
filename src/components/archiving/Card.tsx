import { IArchivingData } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface ICardProps extends IArchivingData {
  link: string;
}
const Card = ({ id, thumbnail, title, description, dev_stack, category, link }: ICardProps) => {
  return (
    <Link href={`${link}/${id}`}>
      <Wrapper>
        <ImageWrapper>
          <CustomImage src={thumbnail} alt="썸네일" layout="fill" objectFit="fill" objectPosition="center" />
        </ImageWrapper>
        <TextWrapper>
          <Category>{category}</Category>
          <ProjectTitle>{title}</ProjectTitle>
          {description && <ProjectDesc>{description}</ProjectDesc>}
          {dev_stack && <div></div>}
        </TextWrapper>
      </Wrapper>
    </Link>
  );
};

export default Card;
const CustomImage = styled(Image)`
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;
const Wrapper = styled.div`
  border-radius: 25px;
  box-shadow: 10px 10px 50px rgba(68, 64, 105, 0.08);
  cursor: pointer;
`;
const ImageWrapper = styled.div`
  position: relative;
  width: 380px;
  height: 213px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  @media (max-width: 1550px) {
    width: 252px;
    height: 150px;
  }
`;
const TextWrapper = styled.div`
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  width: 380px;
  padding: 20px;
  @media (max-width: 1550px) {
    width: 252px;
  }
`;
const Category = styled.div`
  border-color: ${GreyScale.default};
  border-radius: 25px;
  width: 58px;
  height: 19px;
  border-style: solid;
  border-width: 1px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProjectTitle = styled.div`
  font-size: 2.3rem;
  font-weight: 700;
  font-family: 'Pretendard';
  margin: 10px 0;
`;
const ProjectDesc = styled.div`
  font-size: 1.7rem;
  font-weight: 500;
  color: ${GreyScale.default};
`;
