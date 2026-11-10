import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Button from '@common/button/Button';
import TextField from '@common/textField/TextField';
import { IcCircleCheck } from '@assets/svg';
import { VERIFICATION_CODE_LENGTH, VERIFICATION_EXPIRE_SECONDS, verifyCode } from '@recruit/apply/mock';
import { applyFieldHeadingCss } from '@recruit/apply/applyFieldStyle';
import useCountdown, { formatCountdown } from 'src/hooks/useCountdown';
import { isEmailFormatInvalid, isUnfilled } from '@utils/index';
import { Label, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface EmailVerificationFieldProps {
  required?: boolean;
  email: string;
  emailError?: string;
  isVerified: boolean;
  // 인증번호를 보냈으면 true, 기존 지원 상태 안내 등으로 보내지 않았으면 false
  sendCode: (email: string) => Promise<boolean>;
  onEmailChange: (email: string) => void;
  onEmailBlur?: () => void;
  onVerifiedChange: (isVerified: boolean) => void;
}

const EmailVerificationField = ({
  required = false,
  email,
  emailError,
  isVerified,
  sendCode,
  onEmailChange,
  onEmailBlur,
  onVerifiedChange,
}: EmailVerificationFieldProps) => {
  const [code, setCode] = useState('');
  const [isCodeMismatch, setIsCodeMismatch] = useState(false);
  const countdown = useCountdown();

  const sendCodeMutation = useMutation({
    mutationFn: sendCode,
    networkMode: 'always',
    onSuccess: (isSent) => {
      if (!isSent) return;
      setIsCodeMismatch(false);
      setCode('');
      countdown.start(VERIFICATION_EXPIRE_SECONDS);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: (isMatched) => {
      setIsCodeMismatch(!isMatched);
      if (!isMatched) return;
      onVerifiedChange(true);
      countdown.stop();
    },
  });

  const changeEmail = (value: string) => {
    onEmailChange(value);
    onVerifiedChange(false);
    setIsCodeMismatch(false);
    setCode('');
    countdown.stop();
    sendCodeMutation.reset();
  };

  const codeField = (() => {
    if (sendCodeMutation.isError) {
      return { status: 'negative' as const, description: '인증번호 발송에 실패했습니다. 다시 시도해 주세요.' };
    }
    if (countdown.isExpired) {
      return {
        status: 'negative' as const,
        description: '인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.',
      };
    }
    if (isCodeMismatch) return { status: 'negative' as const, description: '인증번호가 일치하지 않습니다.' };
    return { status: 'normal' as const, description: undefined };
  })();

  const canSendCode = !isUnfilled(email) && !isEmailFormatInvalid(email) && !isVerified && !countdown.isRunning;
  const canVerifyCode = code.length === VERIFICATION_CODE_LENGTH && countdown.isRunning && !isVerified;

  const codeTrailing = (() => {
    if (isVerified) {
      return (
        <VerifiedIcon>
          <IcCircleCheck width={22} height={22} />
        </VerifiedIcon>
      );
    }
    return countdown.isRunning && <Timer>{formatCountdown(countdown.remainingSeconds)}</Timer>;
  })();

  return (
    <Root>
      <Row>
        <EmailTextField
          heading="이메일"
          required={required}
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          value={email}
          disabled={isVerified}
          status={emailError ? 'negative' : 'normal'}
          description={emailError}
          onChange={(event) => changeEmail(event.target.value.trim())}
          onBlur={onEmailBlur}
        />
        <SendCodeButton
          disabled={!canSendCode}
          loading={sendCodeMutation.isPending}
          onClick={() => sendCodeMutation.mutate(email)}
        >
          {countdown.isExpired ? '재발송' : '인증번호 받기'}
        </SendCodeButton>
      </Row>
      <Row>
        <TextField
          aria-label="인증번호"
          inputMode="numeric"
          placeholder="인증번호 6자리"
          autoComplete="one-time-code"
          maxLength={isVerified ? undefined : VERIFICATION_CODE_LENGTH}
          value={isVerified ? '이메일이 인증되었습니다.' : code}
          readOnly={isVerified}
          status={codeField.status}
          description={codeField.description}
          trailingContent={codeTrailing}
          onChange={(event) => {
            setCode(event.target.value.replace(/\D/g, ''));
            setIsCodeMismatch(false);
          }}
        />
        <ActionButton
          disabled={!canVerifyCode}
          loading={verifyCodeMutation.isPending}
          onClick={() => verifyCodeMutation.mutate(code)}
        >
          확인
        </ActionButton>
      </Row>
    </Root>
  );
};

export default EmailVerificationField;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const EmailTextField = styled(TextField)`
  ${applyFieldHeadingCss}

  input:disabled {
    color: ${Label.alternative};
    cursor: default;
  }
`;

const ActionButton = styled(Button)`
  flex-shrink: 0;
  width: 144px;
`;

// 오류 문구가 붙어도 버튼이 입력칸 옆에 머물도록, 제목 높이(22px × 1.364 + 간격 8px)만큼 내린다
const SendCodeButton = styled(ActionButton)`
  margin-top: calc(22px * 1.364 + 8px);
`;

const Timer = styled.span`
  flex-shrink: 0;
  padding: 2px 4px;
  color: ${State.info};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const VerifiedIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Orange.o500};
`;
