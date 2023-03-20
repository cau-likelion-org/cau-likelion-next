import React from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { GreyScale } from '@utils/constant/color';

interface ArrowProps {
    direction: string;
    cycleNum: number;
    onClick: () => void;
}

const Arrow = ({ direction, cycleNum, onClick }: ArrowProps) => {
    return (
        <StArrowWrapper onClick={onClick} cycleNum={cycleNum}>
            {direction === 'left' ? <MdKeyboardArrowLeft size={30} color={GreyScale.default} /> :
                <MdKeyboardArrowRight size={30} color={GreyScale.default} />}
        </StArrowWrapper>

    );
};

export default Arrow;


const StArrowWrapper = styled.div<{ cycleNum: number; }>`
    visibility: ${props => props.cycleNum === 1 ? 'hidden' : 'visible'};
    z-index: 20;
    cursor: pointer;
`;