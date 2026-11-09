import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import Checkbox from '@common/checkbox/Checkbox';
import TextField from '@common/textField/TextField';
import EmailVerificationField from '@recruit/EmailVerificationField';
import PasswordFields, { isPasswordFieldsValid } from '@recruit/PasswordFields';
import {
  formatPhoneNumber,
  isEmailFormatInvalid,
  isNameFormatInvalid,
  isPhoneFormatInvalid,
  isUnfilled,
} from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { ApplicantProfile, ApplyClosedError, createApplicantAccount, requestVerificationCode } from './mock';
import ApplyConfirmModal from './ApplyConfirmModal';
import ApplyNoticeModal from './ApplyNoticeModal';
import { applyFieldHeadingCss } from './applyFieldStyle';
import { EMAIL_FORMAT_MESSAGE } from './validation';

type FieldKey = 'name' | 'phone' | 'email';
type Dialog = 'confirm' | 'inProgress' | 'submitted' | 'closed';

export interface IdentityStepProps {
  onComplete: (applicant: ApplicantProfile) => void;
}

const IdentityStep = ({ onComplete }: IdentityStepProps) => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    phone: false,
    email: false,
  });
  const [isVerified, setIsVerified] = useState(false);
  const [dialog, setDialog] = useState<Dialog | null>(null);

  const sendCode = async (targetEmail: string) => {
    const status = await requestVerificationCode(targetEmail);
    if (status === 'IN_PROGRESS') setDialog('inProgress');
    if (status === 'SUBMITTED') setDialog('submitted');
    return status === 'NEW';
  };

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

  const nameError = touched.name && isNameFormatInvalid(name) ? '한글 또는 영문 2~20자로 입력해 주세요.' : undefined;
  const phoneError = touched.phone && isPhoneFormatInvalid(phone) ? '010-0000-0000 형식으로 입력해 주세요.' : undefined;
  const emailError = touched.email && isEmailFormatInvalid(email) ? EMAIL_FORMAT_MESSAGE : undefined;

  const canProceed =
    !isUnfilled(name) &&
    !isNameFormatInvalid(name) &&
    !isUnfilled(phone) &&
    !isPhoneFormatInvalid(phone) &&
    isVerified &&
    isPasswordFieldsValid(password, passwordConfirm) &&
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
        <EmailVerificationField
          required
          email={email}
          emailError={emailError}
          isVerified={isVerified}
          sendCode={sendCode}
          onEmailChange={setEmail}
          onEmailBlur={() => touch('email')}
          onVerifiedChange={setIsVerified}
        />
        <PasswordFields
          heading="비밀번호"
          required
          password={password}
          passwordConfirm={passwordConfirm}
          onPasswordChange={setPassword}
          onPasswordConfirmChange={setPasswordConfirm}
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
          onDimmerClick={() => setDialog(null)}
          actions={[
            { label: '닫기', variant: 'assistive', onClick: () => setDialog(null) },
            { label: '로그인하기', variant: 'primary', onClick: () => router.push('/recruit/history') },
          ]}
        />
      )}
      {dialog === 'submitted' && (
        <ApplyNoticeModal
          title="이미 지원서를 제출하셨어요."
          description="제출한 내용은 지원 내역에서 확인할 수 있어요."
          cancelLabel="닫기"
          confirmLabel="지원 내역 확인하기"
          onCancel={() => setDialog(null)}
          onConfirm={() => router.push('/recruit/history')}
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
