import { Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const PlanDateItem = ({ date }: { date: string; }) => {
    return (
        <Date>{date}</Date>


    );
};

export default PlanDateItem;



const BlackLine = styled.hr`
    color: black;
    height: 2px;
    border: 0px;
    border-top: 2px solid black;
    position: absolute;
`;

const Date = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 2.1rem;
    line-height: 32px;
    text-align: center;
    color: black;
`;

const Circle = styled.div`
    width: 28px;
    height: 28px;
    background-color: ${Primary.default};
    border-radius: 100%;
    box-shadow: 0 0 12px 12px #D3CEFF;

    &:after{
        content: '';
        display:block;
        
        width:200px;
        height: 2px;

        background: red;
        
    }

    
`;

