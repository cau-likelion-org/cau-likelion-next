import { IArchivingData } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface ICardProps extends IArchivingData {
  dev_stack?: number[];
  category?: string | number;
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
          <Category link={link}>{category}</Category>
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
  cursor: pointer;
  box-shadow: 3px 3px 12px rgba(68, 64, 105, 0.08);
  margin: 10px;


  @media (min-width: 1920px) {
    width: 380px;
    height: 400px;
  }

  @media (min-width: 901px) and (max-width: 1919px) {
    box-shadow: 10px 10px 50px rgba(68, 64, 105, 0.08);
    width: 330px;
    height: 370px;
  }
  @media (min-width: 431px) and (max-width: 901px) {

    width: 231px;
    height: 259px;
  }
  @media (min-width: 360px) and (max-width: 430px) {
    width: 231px;
    height: 259px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;

  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  @media (min-width: 1920px) {
    width: 380px;
    height: 250px;
  }
  @media (min-width: 901px) and (max-width: 1919px) {
    width: 330px;
    height: 200px;
  }
  @media (min-width: 431px) and (max-width: 900px) {
    width: 231px;
    height: 140px;
  }
  @media (min-width: 360px) and (max-width: 430px) {
    width: 231px;
    height: 140px;
  }
`;
const TextWrapper = styled.div`
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding: 20px;

  @media (min-width: 360px) and (max-width: 1919px) {
    /* width: 330px; */
  }
  @media (min-width: 1920px) {
    width: 380px;
  }
`;
const Category = styled.div<{ link: string; }>`
  border-radius: 25px;
  // border: 1px solid ${GreyScale.default};
  border: ${props => props.link === 'gallery' ? 'none' : '1px solid ${GreyScale.default}'};
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  display: flex;
  padding: 0.3rem 0;
  align-items: center;
`;

const ProjectTitle = styled.div`
  font-size: 2.3rem;
  font-weight: 700;
  font-family: 'Pretendard';
  margin: 10px 0;

  @media (max-width: 900px){
    font-size: 1.7rem;
  }
`;

const ProjectDesc = styled.div`
  font-size: 1.7rem;
  font-weight: 500;
  color: ${GreyScale.default};
`;
