import React from 'react';
import styled from 'styled-components';

const PlanTitleItem = ({ title }: { title: string; }) => {
    return (
        <Title>{title}</Title>

    );
};

export default PlanTitleItem;


const Title = styled.div`
    color: black;
    font-size: 2.7rem;
    line-height: 40px;
    font-weight: 500;
    white-space: pre; 
    font-family: 'Pretendard';
    font-style: normal;
    text-align: center;
`;