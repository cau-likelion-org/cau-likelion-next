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
  @media (max-width: 1200px) {
    border-style: solid;
    border-radius: 25px;
    border-color: #1a21bd;
    border-width: 2px;
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`;
const StTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-bottom: 15rem;

  .logoTxt {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 900;
    font-size: 5rem;
    margin: 0;
  }

  .subTxt {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 2.1rem;
    color: #fb5101;
    margin: 0;
  }
`;
