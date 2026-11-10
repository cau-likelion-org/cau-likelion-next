import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import PageHeader from '@common/pageHeader/PageHeader';
import EmailVerificationField from '@recruit/EmailVerificationField';
import PasswordFields, { isPasswordFieldsValid } from '@recruit/PasswordFields';
import { requestPasswordResetCode, resetApplicantPassword } from '@recruit/apply/mock';
import { EMAIL_FORMAT_MESSAGE } from '@recruit/apply/validation';
import { isEmailFormatInvalid, isUnfilled } from '@utils/index';

const PasswordResetForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<'verify' | 'password'>('verify');
  const [email, setEmail] = useState('');
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const resetMutation = useMutation({
    mutationFn: resetApplicantPassword,
    networkMode: 'always',
    onSuccess: () => router.replace({ pathname: '/recruit/history', query: { passwordChanged: 'true' } }),
  });

  const emailError =
    isEmailTouched && !isUnfilled(email) && isEmailFormatInvalid(email) ? EMAIL_FORMAT_MESSAGE : undefined;

  if (step === 'verify') {
    return (
      <Root>
        <PageHeader
          align="center"
          title="비밀번호 재설정"
          subtitle="지원서 작성 시 등록한 이메일로 인증번호를 보내드립니다."
        />
        <Fields>
          <EmailVerificationField
            email={email}
            emailError={emailError}
            isVerified={isVerified}
            sendCode={requestPasswordResetCode}
            onEmailChange={setEmail}
            onEmailBlur={() => setIsEmailTouched(true)}
            onVerifiedChange={setIsVerified}
          />
          <FullWidthButton disabled={!isVerified} onClick={() => setStep('password')}>
            다음
          </FullWidthButton>
        </Fields>
      </Root>
    );
  }

  return (
    <Root>
      <PageHeader align="center" title="비밀번호 재설정" subtitle="새로 사용할 비밀번호를 입력해 주세요." />
      <Fields>
        <PasswordFields
          heading="새 비밀번호"
          password={password}
          passwordConfirm={passwordConfirm}
          onPasswordChange={setPassword}
          onPasswordConfirmChange={setPasswordConfirm}
        />
        <FullWidthButton
          disabled={!isPasswordFieldsValid(password, passwordConfirm)}
          loading={resetMutation.isPending}
          onClick={() => resetMutation.mutate({ email, password })}
        >
          비밀번호 변경
        </FullWidthButton>
      </Fields>
      <ToastWrapper>
        <Toast
          variant="negative"
          text="이메일과 비밀번호를 확인해주세요."
          show={resetMutation.isError}
          onHidden={() => resetMutation.reset()}
        />
      </ToastWrapper>
    </Root>
  );
};

export default PasswordResetForm;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 62px;
  width: 100%;
  max-width: 520px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
`;

const FullWidthButton = styled(Button)`
  width: 100%;
`;
