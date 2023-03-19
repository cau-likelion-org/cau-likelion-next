import React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { GreyScale } from '@utils/constant/color';

const Arrow = ({ direction, length, onClick }: { direction: string, length: number; onClick: () => void; }) => {
    return (
        <StArrowWrapper length={length} onClick={onClick}>
            {direction === 'left' ? <MdKeyboardArrowLeft size={30} color={GreyScale.default} /> :
                <MdKeyboardArrowRight size={30} color={GreyScale.default} />}
        </StArrowWrapper>

    );
};

export default Arrow;


const StArrowWrapper = styled.div<{ length: number; }>`
    visibility: ${props => props.length === 0 ? 'hidden' : 'visible'};
    z-index: 20;
    cursor: pointer;
`;