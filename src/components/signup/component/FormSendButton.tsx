import { GreyScale, Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

<<<<<<< HEAD
interface FormSendButtonProps {
    isActive: boolean;
    handleSubmit: () => void;
    buttonTitle: string;
}

const FormSendButton = ({ isActive, handleSubmit, buttonTitle }: FormSendButtonProps) => {
    return (
        <Wrapper><Button isActive={isActive} onClick={handleSubmit}>{buttonTitle}</Button></Wrapper>
=======
const FormSendButton = ({ isActive, handleSubmit }: { isActive: boolean; handleSubmit: () => void; }) => {
    return (
        <Wrapper><Button isActive={isActive} onClick={handleSubmit}>회원가입</Button></Wrapper>
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
    );
};

export default FormSendButton;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
<<<<<<< HEAD
    margin-top: 40px;
=======
    margin-top: 50px;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;

const Button = styled.div<{ isActive: boolean; }>`
    display: flex;
    cursor: ${props => props.isActive ? 'pointer' : 'default'};
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2rem 6rem;
    background-color: ${props => props.isActive ? Primary.default : GreyScale.light};
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 700;
    font-size: 1.4rem;
    border-radius: 100px;
    color: ${props => props.isActive ? '#FEFEFF' : GreyScale.default};
`;