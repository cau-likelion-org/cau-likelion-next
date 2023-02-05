import React from 'react';
import styled from 'styled-components';

import Image from 'next/image';
import googleLogo from '@image/pngwing.com.png';

const LoginButton = () => {
    return (
        <div>
            <ButtonWrapper>
                        <Button className='google'>
                            <Image src={googleLogo} alt='구글' width='38px' height='38px' />
                            <p>구글로 로그인하기</p>
                        </Button>
                        <Button className='likelion'>LIKE LION 계정으로 로그인이 가능합니다.</Button>
            </ButtonWrapper>
            
        </div>
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

p{
    margin-right: 100px;
}
`