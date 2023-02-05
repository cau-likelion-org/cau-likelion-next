import React from 'react';
import styled from 'styled-components';

const LeftSection = () => {
    return (
        <SectionWrapper>
                    <StDiamondWrapper>
                        <Diamond />
                        <Diamond />
                        <Diamond />
                    </StDiamondWrapper>
                    
                    <StTextWrapper>
                        <p> 멋사와 </p>
                        <p> 함께 </p>
                        <p> 꿈을 만들다 </p>
                    </StTextWrapper>
        </SectionWrapper>
    );
};

export default LeftSection;

const SectionWrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-end;
width: 60rem;
height: 50rem;
`

const StDiamondWrapper = styled.div`
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
const StTextWrapper = styled.div`
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