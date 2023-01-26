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
    font-size: 21px;
    line-height: 32px;
    text-align: center;
    color: black;
`;

const Title = styled(Date)`
    color: black;
    font-size: 30px;
    line-height: 40px;
    font-weight: 500;
    white-space: pre; 
`;