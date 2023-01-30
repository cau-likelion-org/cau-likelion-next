import { Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const PlanDateItem = ({ date }: { date: string; }) => {
    return (
        <Date>{date}</Date>


    );
};

export default PlanDateItem;

const Date = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 2rem;
    line-height: 32px;
    text-align: center;
    color: black;
`;
