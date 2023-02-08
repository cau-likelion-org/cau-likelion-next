import React from 'react';
import styled from 'styled-components';
import FooterButton from './FooterButton';
import { GreyScale } from '@utils/constant/color';

const Footer = ({ isLandingLayout }: { isLandingLayout: boolean; }) => {
  const FooterButtonData = [
    {
      type: 'instagram',
      img: '/image/Instagram.png',
      link: 'https://www.instagram.com/likelion_cau',
    },
    {
      type: 'Notion',
      img: '/image/Notion.png',
      link: 'https://www.naver.com',
    },
    {
      type: 'mail',
      img: '/image/Mail.png',
      link: 'mailto:99yunsy@naver.com',
    },
  ];

  return (
    <Wrapper isLandingLayout={isLandingLayout}>
      <TitleText>CAU LIKELION</TitleText>
      <ButtonWrapper>
        {FooterButtonData.map((icon, i: number) => (
          <FooterButton key={i} Img={icon.img} link={icon.link} />
        ))}
      </ButtonWrapper>
      <CopyrightWrapper>@ 2023 CAU LIKELION. All rights reserved.</CopyrightWrapper>
    </Wrapper>
  );
};

export default Footer;

const Wrapper = styled.div<{ isLandingLayout: boolean; }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  gap: 2.5rem;
  position: relative;
  scroll-snap-align: ${(props) => props.isLandingLayout && 'end'};
`;

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-size: 1.8rem;
  text-align: center;
`;

const CopyrightWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${GreyScale.light};
  height: 65px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 32px;
  text-align: center;
  color: ${GreyScale.default};
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 27px;
  margin-bottom: 8px;
`;
