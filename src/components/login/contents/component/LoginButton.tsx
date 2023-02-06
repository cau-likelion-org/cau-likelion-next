import React,  { useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import googleLogo from '@image/pngwing.com.png';



const LoginButton = () => {
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}`;

    const handleClick=()=>{
        window.location.assign(loginUrl)
        console.log(loginUrl);
    }

    return (
        <ButtonWrapper>
            <Button className='google' onClick={handleClick}>
                <Image src={googleLogo} alt='구글' width='38px' height='38px' />
                <p>구글로 로그인하기</p>
            </Button>
            <Button className='likelion'>LIKE LION 계정으로 로그인이 가능합니다.</Button>
        </ButtonWrapper>
    );
};

export default LoginButton;

const ButtonWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

.google{
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 1.7rem;
    border: 2px solid #858585;
    background-color: white;
    margin-bottom: 2rem;

}

.likelion{
    font-size: 1.4rem;
    color: #858585;
    background-color: #F5F5F5;
    border: none;

}
    
`

const Button = styled.button`
width: 360px;
height: 60px;
font-family: 'Pretendard';
font-style: normal;
font-weight: 500;

border-radius: 70px;

z-index: 20;

p{
    margin-right: 100px;
}
`