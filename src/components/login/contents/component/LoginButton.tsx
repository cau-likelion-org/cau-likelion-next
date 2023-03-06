import React, { useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import googleLogo from '@image/pngwing.com.png';



const LoginButton = () => {
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}`;

    const handleClick = () => {
        window.location.assign(loginUrl);
    };

    return (
        <ButtonWrapper>
            <Button className='google' onClick={handleClick}>
                <Image src={googleLogo} alt='구글' width='38px' height='38px' />
                <p className='googleText'>구글로 로그인하기</p>
            </Button>
            <GreyButton className='likelion'>
                <p>LIKE LION 계정으로 로그인이 가능합니다.</p>
            </GreyButton>
        </ButtonWrapper>
    );
};

export default LoginButton;

const ButtonWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
font-size: 1rem;

.google{
    display: flex;
    align-items: center;

    border: 1px solid #858585;
    background-color: white;
    margin-bottom: 2rem;

}

.likelion{
    color: #858585;
    background-color: #F5F5F5;
    border: none;

}

p{
    @media(max-width: 900px){
        font-size:0.8rem;}
    }
    
`;

const Button = styled.button`
    display: flex;
    justify-content: space-between;

    width: 25rem;
    height: 5rem;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    cursor: pointer;
    border-radius: 70px;
    z-index: 20;

    .googleText{margin-right: 5rem;}


`;

const GreyButton = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;

    p{text-align: center;}
`;