import { BackgroundColor, GreyScale, Primary } from '@utils/constant/color';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

const EmailErrorModal = ({ setIsErrorModalOn }: { setIsErrorModalOn: Dispatch<SetStateAction<boolean>>; }) => {
    const handleClickButton = () => {
        setIsErrorModalOn(false);
    };

    return (
        <Layer>
            <Wrapper>
                <Text>입력하신 인증번호가 올바르지 않습니다.</Text>
                <Button onClick={handleClickButton}>확인</Button>
            </Wrapper>
        </Layer>
    );
};

export default EmailErrorModal;

const Layer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10000;
`;



const Wrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    background-color: ${BackgroundColor};
    border-radius: 1rem;
    box-shadow: 10px 10px 30px 0px #00000014;
    padding: 3rem 8rem;
    z-index: 10001;
`;

const Text = styled.div`
    display: flex;
    justify-content: center;
    font-size: 1.7rem;
    font-family: 'Pretendard';
`;

const Button = styled.div`
    font-size: 1.5rem;
    font-family: 'Pretendard';
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${Primary.default};
    color: ${GreyScale.light};
    width: 50%;
    padding: 1rem;
    border-radius: 10rem;
    cursor: pointer;
    margin-top: 20px;
`;