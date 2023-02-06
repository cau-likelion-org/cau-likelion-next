import { Basic, GreyScale, Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

interface ITextInputProps {
    title: string;
    description: string;
    placeholder: string;
    value?: string;
    onChange: (e: any) => void;
}

const TextInputBox = ({ title, description, placeholder, value, onChange }: ITextInputProps) => {


    return (
        <RowContainer>
            <Title>{title}</Title>
            <InputRow>
                <InputBox value={value} onChange={onChange} placeholder={placeholder} />
                <Description>*{description}</Description>
            </InputRow>
        </RowContainer>
    );
};

export default TextInputBox;

const RowContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    height: 100px;
    border-bottom: 1px solid ${GreyScale.default};
`;

const Title = styled.div`
    flex-basis: 20%;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    background-color: ${Primary.light};
    height: 100%;
    min-width: 180px;
    padding: 1rem;
    display: flex;
    align-items: center;
`;

const InputRow = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
`;

const InputBox = styled.input`
    border-radius: 1rem;
    border: 1px solid ${GreyScale.default};
    height: 45px;
    flex-basis: 45%;
    padding: 1rem;
    font-size: 1.4rem;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    &.placeholder{
        color: ${GreyScale.default};
    }
     &:focus {
        &::placeholder {
            color: transparent;
        }
    }
    color: ${Basic.default};
`;

const Description = styled.div`
    font-size: 1.4rem;
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    color: ${GreyScale.default};
`;