import React from 'react';
import styled from 'styled-components';
import { SectionWrapper } from '../../common/SectionWrapper';
import LoginButton from './LoginButton';

const RightSection = () => {
  return (
    <StCustomWrapper>
      <StTextWrapper>
        <p className="logoTxt"> LIKELION </p>
        <p className="subTxt"> at Chung-ang Univeristy </p>
      </StTextWrapper>
      <LoginButton />
    </StCustomWrapper>
  );
};

export default RightSection;

const StCustomWrapper = styled(SectionWrapper)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10rem;


  @media (max-width: 1200px) {
    height: 100%;
    align-items: center;
    justify-content: center;
    margin: 0rem;
  }
`;

const StTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;

  @media (max-width: 1200px){
    margin-bottom: 10rem;
  }

  p{
    text-align: center;
    width: 25rem;
  }
 

  .logoTxt {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 900;
    font-size: 4rem;
    margin: 0;
  }

  .subTxt {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 1.8rem;
    color: #fb5101;
    margin: 0;
  }
`;
