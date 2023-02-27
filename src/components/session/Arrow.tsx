import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import arrow from '@image/Vector 16.png'

interface ISessionComponent {
    direction : string;
}

const Arrow = ({direction}:{direction:string}) => {
    return (
        <StArrowWrapper direction={direction} >
            <Image src={arrow} width='20px' height='20px' alt='화살표' />
        </StArrowWrapper>

    );
};

export default Arrow;


const StArrowWrapper = styled.div<ISessionComponent>`
transform: ${({direction})=>(direction === 'left' ? 'rotate(180deg)' : null)};
padding-left: 2rem;

`