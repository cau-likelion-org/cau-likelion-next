import React from 'react';
import styled from 'styled-components';
import FooterButton from './FooterButton';
import KakaoImg from '@image/푸터카카오.svg';
import MailImg from '@image/푸터메일.svg';
import InstaImg from '@image/푸터인스타.svg';
import { GreyScale } from '@utils/constant/color';

const Footer = () => {
    const FooterButtonData = [
        {
            type: "instagram",
            img: InstaImg,
            link: "https://www.instagram.com/likelion_cau"
        },
        {
            type: "kakaotalk",
            img: KakaoImg,
            link: "https://www.naver.com"
        },
        {
            type: "mail",
            img: MailImg,
            link: "mailto:99yunsy@naver.com"
        }
    ];

    return (
        <Wrapper>
            <TitleText>CAU LIKELION</TitleText>
            <ButtonWrapper>
                {
                    FooterButtonData.map((icon, i: number) => (
                        <FooterButton key={i} type={icon.type} Img={icon.img} link={icon.link} />
                    ))
                }
            </ButtonWrapper>
            <CopyrightWrapper>
                @ 2023 CAU LIKELION. All rights reserved.
            </CopyrightWrapper>
        </Wrapper>
    );
};

export default Footer;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    gap: 40px;
    position: relative;
`;

const TitleText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 900;
    font-size: 2.7rem;
    line-height: 41px;
    text-align: center;
`;

const CopyrightWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${GreyScale.light};
    height: 79px;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 2.1rem;
    line-height: 32px;
    text-align: center;
    color: ${GreyScale.default};
`;

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 30px;
`;