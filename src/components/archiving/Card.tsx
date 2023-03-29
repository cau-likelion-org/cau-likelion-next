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

const Card = ({ id, thumbnail, title, dev_stack, category, link, subtitle }: ICardProps) => {
  return (
    <Link href={`${link}/${id}`}>
      <Wrapper>
        <ImageWrapper>
          <CustomImage
            src={thumbnail}
            alt="썸네일"
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
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
`;

const Wrapper = styled.div`
  border-radius: 20px;
  cursor: pointer;
  box-shadow: 3px 3px 3px 3px rgba(68, 64, 105, 0.08);
  display: flex;
  margin: 10px;
  padding: 10px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.div`
  position: relative;

  @media (min-width: 1920px) {
    width: 360px;
    height: 240px;
  }

  @media (min-width: 901px) and (max-width: 1919px) {
    width: 310px;
    height: 190px;
  }

  @media (min-width: 661px) and (max-width: 900px) {
    width: 280px;
    height: 130px;
  }

  @media (min-width: 445px) and (max-width: 660px) {
    width: 220px;
    height: 120px;
  }

  @media (min-width: 330px) and (max-width: 444px) {
    width: 160px;
    height: 100px;
  }
`;
const TextWrapper = styled.div`
  padding: 20px;

  @media (min-width: 1920px) {
    width: 380px;
  }
  @media (min-width: 901px) and (max-width: 1919px) {
    width: 330px;
  }

  @media (min-width: 661px) and (max-width: 900px) {
    width: 300px;
  }
  @media (min-width: 445px) and (max-width: 660px) {
    width: 240px;
  }
  @media (min-width: 330px) and (max-width: 444px) {
    width: 180px;
  }

`;
const Category = styled.div<{ link: string; }>`
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
