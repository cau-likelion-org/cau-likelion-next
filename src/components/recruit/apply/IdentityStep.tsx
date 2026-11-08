import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import Checkbox from '@common/checkbox/Checkbox';
import TextField from '@common/textField/TextField';
import useCountdown, { formatCountdown } from 'src/hooks/useCountdown';
import {
  formatPhoneNumber,
  getPasswordError,
  isEmailFormatInvalid,
  isNameFormatInvalid,
  isPhoneFormatInvalid,
  isUnfilled,
} from '@utils/index';
import { Label, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import {
  ApplicantProfile,
  ApplyClosedError,
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_EXPIRE_SECONDS,
  createApplicantAccount,
  requestVerificationCode,
  verifyCode,
} from './mock';
import ApplyConfirmModal from './ApplyConfirmModal';
import ApplyNoticeModal from './ApplyNoticeModal';
import { applyFieldHeadingCss } from './applyFieldStyle';

type FieldKey = 'name' | 'phone' | 'email' | 'password' | 'passwordConfirm';
type Dialog = 'confirm' | 'inProgress' | 'submitted' | 'closed';

const PASSWORD_CAPTION = '영문 대소문자, 숫자, 특수문자를 사용할 수 있습니다.';

export interface IdentityStepProps {
  onComplete: (applicant: ApplicantProfile) => void;
}

const IdentityStep = ({ onComplete }: IdentityStepProps) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    phone: false,
    email: false,
    password: false,
    passwordConfirm: false,
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeMismatch, setIsCodeMismatch] = useState(false);
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const countdown = useCountdown();

  const sendCodeMutation = useMutation({
    mutationFn: requestVerificationCode,
    onSuccess: (status) => {
      if (status === 'IN_PROGRESS') return setDialog('inProgress');
      if (status === 'SUBMITTED') return setDialog('submitted');
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
      setIsVerified(true);
      countdown.stop();
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: createApplicantAccount,
    onSuccess: () => {
      setDialog(null);
      onComplete({ name, phone, email });
    },
    onError: (error) => {
      if (error instanceof ApplyClosedError) setDialog('closed');
    },
  });

  const touch = (key: FieldKey) => setTouched((prev) => ({ ...prev, [key]: true }));

  const changeEmail = (value: string) => {
    setEmail(value);
    setIsVerified(false);
    setIsCodeMismatch(false);
    setCode('');
    countdown.stop();
  };

  const nameError = touched.name && isNameFormatInvalid(name) ? '한글 또는 영문 2~20자로 입력해 주세요.' : undefined;
  const phoneError = touched.phone && isPhoneFormatInvalid(phone) ? '010-0000-0000 형식으로 입력해 주세요.' : undefined;
  const emailError = touched.email && isEmailFormatInvalid(email) ? '이메일 형식이 올바르지 않습니다.' : undefined;
  const passwordError = touched.password ? getPasswordError(password) : undefined;
  const passwordConfirmError =
    touched.passwordConfirm && !isUnfilled(passwordConfirm) && passwordConfirm !== password
      ? '비밀번호가 일치하지 않습니다.'
      : undefined;

  const codeField = (() => {
    if (isVerified) return { status: 'positive' as const, description: undefined };
    if (countdown.isExpired) return { status: 'negative' as const, description: '인증번호가 만료되었습니다.' };
    if (isCodeMismatch) return { status: 'negative' as const, description: '인증번호가 일치하지 않습니다.' };
    return { status: 'normal' as const, description: undefined };
  })();

  const canSendCode = !isUnfilled(email) && !isEmailFormatInvalid(email) && !isVerified && !countdown.isRunning;
  const canVerifyCode = code.length === VERIFICATION_CODE_LENGTH && countdown.isRunning && !isVerified;
  const canProceed =
    !isUnfilled(name) &&
    !isNameFormatInvalid(name) &&
    !isUnfilled(phone) &&
    !isPhoneFormatInvalid(phone) &&
    isVerified &&
    !isUnfilled(password) &&
    !getPasswordError(password) &&
    passwordConfirm === password &&
    isAgreed;

  return (
    <Root>
      <Fields>
        <ApplyTextField
          heading="이름"
          required
          placeholder="홍길동"
          maxLength={20}
          autoComplete="name"
          value={name}
          status={nameError ? 'negative' : 'normal'}
          description={nameError}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => touch('name')}
        />
        <ApplyTextField
          heading="전화번호"
          required
          type="tel"
          inputMode="numeric"
          placeholder="010-0000-0000"
          autoComplete="tel"
          value={phone}
          status={phoneError ? 'negative' : 'normal'}
          description={phoneError}
          onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}
          onBlur={() => touch('phone')}
        />
        <EmailGroup>
          <EmailRow>
            <ApplyTextField
              heading="이메일"
              required
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              value={email}
              readOnly={isVerified}
              status={emailError ? 'negative' : 'normal'}
              description={emailError}
              onChange={(event) => changeEmail(event.target.value.trim())}
              onBlur={() => touch('email')}
            />
            <SendCodeButton
              disabled={!canSendCode}
              loading={sendCodeMutation.isPending}
              onClick={() => sendCodeMutation.mutate(email)}
            >
              {countdown.isExpired ? '재발송' : '인증번호 받기'}
            </SendCodeButton>
          </EmailRow>
          <CodeRow>
            <TextField
              aria-label="인증번호"
              inputMode="numeric"
              placeholder="인증번호 6자리"
              autoComplete="one-time-code"
              maxLength={VERIFICATION_CODE_LENGTH}
              value={code}
              readOnly={isVerified}
              status={codeField.status}
              description={codeField.description}
              trailingContent={countdown.isRunning && <Timer>{formatCountdown(countdown.remainingSeconds)}</Timer>}
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
          </CodeRow>
        </EmailGroup>
        <ApplyTextField
          heading="비밀번호"
          required
          type="password"
          placeholder="8자 이상 입력해 주세요"
          autoComplete="new-password"
          value={password}
          status={passwordError ? 'negative' : 'normal'}
          description={passwordError ?? PASSWORD_CAPTION}
          onChange={(event) => setPassword(event.target.value)}
          onBlur={() => touch('password')}
        />
        <ApplyTextField
          heading="비밀번호 확인"
          required
          type="password"
          placeholder="비밀번호를 한 번 더 입력해 주세요"
          autoComplete="new-password"
          value={passwordConfirm}
          status={passwordConfirmError ? 'negative' : 'normal'}
          description={passwordConfirmError}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          onBlur={() => touch('passwordConfirm')}
        />
        <AgreementRow>
          <Checkbox label="[필수] 개인정보 수집·이용에 동의합니다" checked={isAgreed} onChange={setIsAgreed} />
          <DetailButton type="button">내용 확인</DetailButton>
        </AgreementRow>
      </Fields>
      <Button disabled={!canProceed} onClick={() => setDialog('confirm')}>
        다음
      </Button>
      {dialog === 'confirm' && (
        <ApplyConfirmModal
          name={name}
          phone={phone}
          email={email}
          loading={createAccountMutation.isPending}
          onCancel={() => setDialog(null)}
          onConfirm={() => createAccountMutation.mutate({ name, phone, email, password })}
        />
      )}
      {dialog === 'inProgress' && (
        <Alert
          heading="이미 작성 중인 지원서가 있습니다."
          body="로그인 후 이어서 작성해 주세요."
          onDimmerClick={() => setDialog(null)}
          actions={[{ label: '확인', variant: 'primary', onClick: () => setDialog(null) }]}
        />
      )}
      {dialog === 'submitted' && (
        <ApplyNoticeModal
          title="이미 지원서를 제출하셨어요."
          description="제출한 내용은 지원 내역에서 확인할 수 있어요."
          cancelLabel="닫기"
          confirmLabel="지원 내역 확인하기"
          onCancel={() => setDialog(null)}
          onConfirm={() => setDialog(null)}
        />
      )}
      {dialog === 'closed' && (
        <Alert
          heading="모집이 마감되었습니다."
          body="지원서 접수 기간이 지나 지원서를 작성할 수 없습니다."
          actions={[{ label: '확인', variant: 'primary', onClick: () => router.replace('/recruit') }]}
        />
      )}
    </Root>
  );
};

export default IdentityStep;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 78px;
  width: 100%;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
`;

const ApplyTextField = styled(TextField)`
  ${applyFieldHeadingCss}
`;

const EmailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const EmailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const CodeRow = styled(EmailRow)``;

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

const AgreementRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
`;

const DetailButton = styled.button`
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.alternative};
  text-decoration: underline;
  cursor: pointer;
  ${typographyCss(Typography.body2Normal.regular)}
`;
