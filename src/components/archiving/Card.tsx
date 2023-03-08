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

const Card = ({ id, thumbnail, title, description, dev_stack, category, link, subtitle }: ICardProps) => {
  return (
    <Link href={`${link}/${id}`}>
      <Wrapper>
        <ImageWrapper>
          <CustomImage src={thumbnail} alt="썸네일" layout="fill" objectFit="contain" objectPosition="center" />
        </ImageWrapper>
        <TextWrapper>
          <Category link={link}>{category}</Category>
          <ProjectTitle>{title}</ProjectTitle>
          {subtitle && <ProjectDesc>{subtitle}</ProjectDesc>}
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
  height: 100%;

  @media (min-width: 1920px) {
    width: 380px;
    min-height: 400px;
  }

  @media (min-width: 901px) and (max-width: 1919px) {
    width: 330px;
    min-height: 370px;
  }
  @media (min-width: 431px) and (max-width: 901px) {
    width: 231px;
    min-height: 259px;
  }
  @media (min-width: 360px) and (max-width: 430px) {
    width: 231px;
    min-height: 259px;
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
const Category = styled.div<{ link: string }>`
  border-radius: 25px;
  border: ${(props) => (props.link === '/gallery' ? 'none' : `1px solid ${GreyScale.default}`)};
  display: flex;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  padding: 0.3rem 0;
  align-items: center;
  justify-content: center;
  width: 8rem;
`;

const ProjectTitle = styled.div`
  font-size: 2.3rem;
  font-weight: 700;
  font-family: 'Pretendard';
  margin: 10px 0;

  @media (max-width: 900px) {
    font-size: 1.7rem;
  }
`;

const ProjectDesc = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  color: ${GreyScale.default};
  @media (max-width: 1200px) {
    font-size: 5px;
  }
  @media (max-width: 1300px) {
    font-size: 10px;
  }
`;
