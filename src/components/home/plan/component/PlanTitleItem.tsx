import React from 'react';
import styled from 'styled-components';

const PlanTitleItem = ({ title }: { title: string; }) => {
    return (
        <Title>{title}</Title>

    );
};

export default PlanTitleItem;



const Date = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 2.1rem;
    line-height: 32px;
    text-align: center;
    color: black;
`;

const Title = styled(Date)`
    color: black;
    font-size: 2.7rem;
    line-height: 40px;
    font-weight: 500;
    white-space: pre; 
`;