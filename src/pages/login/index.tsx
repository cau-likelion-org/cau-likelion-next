import React,{ReactElement} from 'react';
import styled from 'styled-components';
import Image from 'next/image'
import googleLogo from '@image/pngwing.com.png';

import LayoutLogin from '@common/layout/LayoutLogin';

const Login = () => {
    return (
        <>
        <StWrapper>
            <Wrapper>   
                <LeftSection>
                    <DiamondWrapper>
                        <Diamond />
                        <Diamond />
                        <Diamond />
                    </DiamondWrapper>
                    
                    <StLeftTxtWrapper>
                        <p> 멋사와 </p>
                        <p> 함께 </p>
                        <p> 꿈을 만들다 </p>
                    </StLeftTxtWrapper>
                </LeftSection>

                <RightSection>
                    <StRightTxtWrapper>
                        <p className='logoTxt'> LIKELION </p>
                        <p className='subTxt'> at Chung-ang Univeristy </p>
                    </StRightTxtWrapper>

                    <ButtonWrapper>
                        <LoginButton className='google'>
                            <Image src={googleLogo} alt='구글' width='38px' height='38px' />
                            <p>구글로 로그인하기</p>
                        </LoginButton>
                        <LoginButton className='likelion'>LIKE LION 계정으로 로그인이 가능합니다.</LoginButton>
                    </ButtonWrapper>
                </RightSection>
            </Wrapper>

            <AnimationWrapper>
                <span className='bottom'></span>
                <span className='right'></span>
                <span className='top'></span>
                <span className='left'></span>
                <Diamond className='aniDiamond' />
            </AnimationWrapper>


        </StWrapper>

        

        
        
        </>
    ); 
};

Login.getLayout = function getLayout(page: ReactElement) {
    return <LayoutLogin>{page}</LayoutLogin>;
};

export default Login;

const StWrapper=styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
height: 100vh;

padding:0 30rem;

`
const Wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: relative;
height: 100rem;
padding-top: 10rem;

width: 120rem;
`

const LeftSection = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-end;
width: 60rem;
height: 50rem;


`

const RightSection = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
width: 60rem;
height: 50rem;


`


const DiamondWrapper = styled.div`
display: flex;
margin-bottom: 30px;
`
const Diamond = styled.div`
width: 11px;
height: 11px;
margin-right: 15px;


background: #1A21BD;
transform: rotate(45deg);
`
const StLeftTxtWrapper = styled.div`
display: flex;
flex-direction: column;


p{
    margin: 0;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 900;
    font-size:8rem;
}
    
`
const StRightTxtWrapper=styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;

margin-bottom: 15rem;

.logoTxt{
font-family: 'Inter';
font-style: normal;
font-weight: 900;
font-size: 5rem;
margin: 0;

}

.subTxt{
font-family: 'Inter';
font-style: normal;
font-weight: 500;
font-size: 2.1rem;
color: #FB5101;
margin: 0;
}
`

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

const LoginButton = styled.button`
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

const AnimationWrapper=styled.div`
position:absolute;
width: 120rem;
height: 100rem;
padding-top: 10rem;



span{
    position:absolute;
    display: flex;
    justify-content: center; 
    left: 360px;
    right: 360px;

    top: 10rem;
    /* bottom: 0; */
    width: 100%;
    height: 100%;
}

//border-bottom
span:nth-child(1) {
    left:0;
    right:0;
    height: 75rem;
    width: 100%;
    border-bottom: 4px #1A21BD solid;
    border-bottom-right-radius: 70px;

}

//border-right
span:nth-child(2) {
    left:0;
    right:0;
    top: 15rem;
    height: 70rem;
    width: 100%;
    border-right: 4px #1A21BD solid;
    border-radius: 70px;
}

//border-top
span:nth-child(3) {
    left:60rem;
    right:0;
    top: 15rem;
    height: 70rem;
    width: 50%;
    border-top: 4px #1A21BD solid;
    border-radius: 70px;
}

//border-left
span:nth-child(4) {
    left:60rem;
    right:0;
    top: 15rem;
    height: 60rem;
    width: 50%;
    border-left: 4px #1A21BD solid;
    border-top-left-radius: 70px;
}

.aniDiamond{
    position: absolute;
    left:59.7rem;
    right:0rem;
    top: 75rem;
}
    
`

