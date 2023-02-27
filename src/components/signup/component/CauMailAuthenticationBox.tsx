import { Basic, GreyScale, Primary } from '@utils/constant/color';
import { accessToken } from '@utils/state';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { getEmailSecret, postEmailSecret } from 'src/apis/account';
import styled from 'styled-components';
import EmailErrorModal from './EmailErrorModal';
import EmailModal from './EmailModal';

interface IProps {
    title: string;
    emailValue: string;
    onChangeEmail: (e: any) => void;
    secretValue: string;
    onChangeSecret: (e: any) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}

const CauMailAuthenticationBox = ({ title, emailValue, onChangeEmail, secretValue, onChangeSecret, isAuthenticated, setIsAuthenticated }: IProps) => {
    const tokenState = useRecoilValue(accessToken);
    const [isEmailModalOn, setIsEmailModalOn] = useState(false);
    const [isErrorModalOn, setIsErrorModalOn] = useState(false);

    const handleEmailRequestButton = async () => {
        const response = await getEmailSecret(tokenState, emailValue);
        setIsEmailModalOn(!isEmailModalOn);
    };

    const handleSecretKeyButton = async () => {
        const response = await postEmailSecret(tokenState, secretValue);
        if (response == secretValue) setIsAuthenticated(true);
        else setIsErrorModalOn(true);
    };

    return (
        <RowContainer>
            <Title>{title}</Title>
            <InputColumn>
                <EmailRequestRow>
                    <EmailInput value={emailValue} onChange={onChangeEmail} placeholder={'LIKELION'} />
                    <CauEmailText>@ cau.ac.kr</CauEmailText>
                    <RequestButton onClick={handleEmailRequestButton}>인증 요청</RequestButton>
                </EmailRequestRow>
                <SecretKeyRow>
                    <SecretKeyInput value={secretValue} onChange={onChangeSecret} />
                    {isAuthenticated ?
                        <SuccessButton>인증 완료</SuccessButton> :
                        <SecretKeyButton onClick={handleSecretKeyButton}>인증 확인</SecretKeyButton>}
                </SecretKeyRow>
            </InputColumn>
            {isEmailModalOn &&
                <EmailModal email={emailValue} setIsEmailModalOn={setIsEmailModalOn} />}
            {isErrorModalOn &&
                <EmailErrorModal setIsErrorModalOn={setIsErrorModalOn} />}
        </RowContainer>
    );
};

export default CauMailAuthenticationBox;

const RowContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    height: 160px;
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

const InputColumn = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    gap: 15px;
`;

const EmailRequestRow = styled.div`
    display: flex;
    align-items: center;
    width: 70%;
    gap: 10px;
`;

const CauEmailText = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    color: ${Basic.default};
`;

const EmailInput = styled.input`
    border-radius: 1rem;
    border: 1px solid ${GreyScale.default};
    height: 45px;
    flex-basis: 40%;
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

const SecretKeyInput = styled(EmailInput)`
    flex-basis: 40%;
`;

const RequestButton = styled.div`
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 1.3rem;
    width: 100px;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${Basic.default};
    color: #FEFEFF;
    cursor: pointer;
    margin-left: 15px;
`;

const SecretKeyRow = styled(EmailRequestRow)`
`;

const SecretKeyButton = styled(RequestButton)``;

const SuccessButton = styled(RequestButton)`
    background-color: ${GreyScale.light};
    color: ${Basic.default};
    cursor: default;
    margin-left: 4px;
`;