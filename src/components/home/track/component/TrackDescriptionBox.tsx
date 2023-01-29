import React from 'react';
import styled from 'styled-components';

interface TrackDescriptionBoxProps {
    type: string;
    title: string;
    text: string;
}

const TrackDescriptionBox = ({ type, title, text }: TrackDescriptionBoxProps) => {
    return (
        <BoxWrapper type={type}>
            <BoldText>{title}</BoldText>
            <Text>{text}</Text>
        </BoxWrapper>
    );
};

export default TrackDescriptionBox;

const BoxWrapper = styled.div<{ type: string; }>`
    background: #F2F1FF;
    border-radius: 18px;
    padding: 50px;
    display: flex;
    flex-direction: column;
    gap: 36px;
    @media(min-width: 1200px){
        flex-basis: ${props => props.type === 'recommend' ? '33%' : '66%'};
        min-height: 540px;

    }
    @media(max-width: 1200px) {
        margin: 0;
    }
`;

const Text = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-size: 3rem;
    color: black;
    font-weight: 500;
    line-height: 166.52%;
`;

const BoldText = styled(Text)`
    font-weight: 700;
    line-height: 153.02%;
`;

