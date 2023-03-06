import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import arrow from '@image/Vector 16.png';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { GreyScale } from '@utils/constant/color';

interface ISessionComponent {
    direction: string;
    length: number;
}

const Arrow = ({ direction, length }: { direction: string, length: number; }) => {
    return (
        <StArrowWrapper length={length}>
            {direction === 'left' ? <MdKeyboardArrowLeft size={30} color={GreyScale.default} /> :
                <MdKeyboardArrowRight size={30} color={GreyScale.default} />}
        </StArrowWrapper>

    );
};

export default Arrow;


const StArrowWrapper = styled.div<{ length: number; }>`
visibility: ${props => props.length === 0 ? 'hidden' : 'visible'};

padding-left: 2rem;
`;