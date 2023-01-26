import { PrimaryBlue } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const PlanItem = ({ title, date }: { title: string; date: string; }) => {
    return (
        <ItemWrapper>
            <Date>{date}</Date>
            <Circle />
            <Title>{title}</Title>
        </ItemWrapper>
    );
};

export default PlanItem;

const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 120px;
    align-items: center;
`;

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
    font-size: 21px;
    line-height: 32px;
    text-align: center;
    color: black;
`;

const Circle = styled.div`
    width: 28px;
    height: 28px;
    background-color: ${PrimaryBlue.default};
    border-radius: 100%;
    box-shadow: 0 0 12px 12px #D3CEFF;
`;

const Title = styled(Date)`
    font-size: 30px;
    line-height: 40px;
    font-weight: 500;
    white-space: pre;
`;