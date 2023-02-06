import React from 'react';
import styled from 'styled-components';

import { SectionWrapper } from '../../common/SectionWrapper';
import LoginButton from './LoginButton';

const RightSection = () => {
    return (
        <SectionWrapper>
            <StTextWrapper>
                <p className='logoTxt'> LIKELION </p>
                <p className='subTxt'> at Chung-ang Univeristy </p>
            </StTextWrapper>

            <LoginButton />
        </SectionWrapper>
    );
};

export default RightSection;

const StTextWrapper=styled.div`
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
