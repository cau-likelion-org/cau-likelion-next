import { IArchivingData } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

interface ICardProps extends IArchivingData {
  link: string;
}
<<<<<<< HEAD

=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
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
  @media (min-width: 1920px) {
    width: 380px;
    height: 400px;
  }
  @media (min-width: 360px) and (max-width: 1919px) {
    width: 330px;
    height: 370px;
  }
`;
const ImageWrapper = styled.div`
  position: relative;

  border-top-left-radius: 25px;
  border-top-right-radius: 25px;

  @media (min-width: 360px) and (max-width: 1919px) {
    width: 330px;
    height: 200px;
  }
  @media (min-width: 1920px) {
    width: 380px;
    height: 250px;
  }
`;
const TextWrapper = styled.div`
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding: 20px;

  @media (min-width: 360px) and (max-width: 1919px) {
    width: 330px;
  }
  @media (min-width: 1920px) {
    width: 380px;
  }
`;
const Category = styled.div`
<<<<<<< HEAD
  border-radius: 25px;
  border: 1px solid ${GreyScale.default};
  max-width: 25%;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  display: flex;
  padding: 0.3rem 0;
=======
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
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
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
