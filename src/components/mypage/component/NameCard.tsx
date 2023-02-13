import { Basic, GreyScale, Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const NameCard = ({ name, generation }: { name: string; generation: number; }) => {
    return (
        <Wrapper>
            <Text><span>{generation}</span>기 &nbsp;<span>{name}</span>님</Text>
        </Wrapper>
    );
};

export default NameCard;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
`;

const Text = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 2.5rem;
    color: ${Basic.default};
    line-height: 3rem;

    > span{
        font-weight: 900;
        font-size: 3rem;
        text-align: center;
    }
`;