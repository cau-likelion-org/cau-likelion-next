import React from 'react';
import styled from 'styled-components';
import { PrimaryBlue, PrimaryPurple } from '@utils/constant/color';


const PlanDotItem = () => {
    return (
        <>
            <BlackLine />
            {Array.from({ length: 4 }, (item, index) => (
                    <Circle key={index} />
            ))}
            
            
        </>
    );
};

export default PlanDotItem;

const Circle = styled.div`
    width: 28px;
    height: 28px;
    background-color: ${PrimaryBlue.default};
    border-radius: 100%;

    position: relative;


    &::before{
        content: "";
        width: 52px;
        height: 52px;
        background-color: #D3CEFF;
        border-radius: 100%;

        position: absolute;
        top: -12px;
        left: -12px;

        z-index: -1;

    }
`;

const BlackLine = styled.hr`
    position: absolute;
    width: 100%;
    height: 1px;

    border: 0px;
    border-top: 2px solid black;

    z-index: 0;

`

const BigCircle = styled(Circle)`
    display:flex;
    justify-content: center;
    align-items: center;

    width: 52px;
    height: 52px;
    background-color:#D3CEFF;

    z-index: 0;

`

