import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import TextButton from '@common/textButton/TextButton';
import TextField from '@common/textField/TextField';
import ApplyNoticeModal from '@recruit/apply/ApplyNoticeModal';
import { applyFieldHeadingCss } from '@recruit/apply/applyFieldStyle';
import { ApplicantLoginError, loginApplicant } from '@recruit/apply/mock';
import { isUnfilled } from '@utils/index';
import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface ApplicantLoginFormProps {
  isApplyOpen: boolean;
  onSubmittedHistory: (history: { submittedAt: string; part: string }) => void;
}

const ApplicantLoginForm = ({ isApplyOpen, onSubmittedHistory }: ApplicantLoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [isNoHistoryOpen, setIsNoHistoryOpen] = useState(false);

  const loginMutation = useMutation({
    mutationFn: loginApplicant,
    onSuccess: (history) => {
      if (history.status === 'SUBMITTED') return onSubmittedHistory(history);
      setIsNoHistoryOpen(true);
    },
    onError: (error) => {
      if (error instanceof ApplicantLoginError) setIsLoginFailed(true);
    },
  });

  const canLogin = !isUnfilled(email) && !isUnfilled(password);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canLogin) return;
    loginMutation.mutate({ email, password });
  };

  const closeNoHistory = () => setIsNoHistoryOpen(false);

  return (
    <Root>
      <TitleGroup>
        <Title>지원 내역 확인</Title>
        <Subtitle>
          지원서 작성 시 등록한 이메일과 비밀번호로
          <br />
          로그인해 주세요.
        </Subtitle>
      </TitleGroup>
      <Form onSubmit={submit}>
        <LoginTextField
          heading="이메일"
          type="email"
          placeholder="example@email.com"
          autoComplete="email"
          value={email}
          status={isLoginFailed ? 'negative' : 'normal'}
          onChange={(event) => {
            setEmail(event.target.value.trim());
            setIsLoginFailed(false);
          }}
        />
        <LoginTextField
          heading="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          autoComplete="current-password"
          value={password}
          status={isLoginFailed ? 'negative' : 'normal'}
          description={isLoginFailed ? '이메일 또는 비밀번호가 올바르지 않습니다.' : undefined}
          onChange={(event) => {
            setPassword(event.target.value);
            setIsLoginFailed(false);
          }}
        />
        <Actions>
          <LoginButton type="submit" disabled={!canLogin} loading={loginMutation.isPending}>
            로그인
          </LoginButton>
          <ResetPasswordButton>비밀번호 재설정</ResetPasswordButton>
        </Actions>
      </Form>
      {isNoHistoryOpen &&
        (isApplyOpen ? (
          <ApplyNoticeModal
            title="제출한 지원서가 없습니다."
            description={'이전에 작성하던 내용은 저장되지 않아\n처음부터 다시 작성해야 합니다.'}
            cancelLabel="닫기"
            confirmLabel="지원서 작성하기"
            onCancel={closeNoHistory}
            onConfirm={() => router.push('/recruit/apply')}
          />
        ) : (
          <Alert
            heading="제출한 지원서가 없습니다."
            body="서류 접수 기간이 종료되었습니다."
            onDimmerClick={closeNoHistory}
            actions={[{ label: '닫기', variant: 'primary', onClick: closeNoHistory }]}
          />
        ))}
    </Root>
  );
};

export default ApplicantLoginForm;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 62px;
  width: 100%;
  max-width: 520px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  color: ${Orange.o500};
  text-align: center;
  word-break: keep-all;
`;

const Title = styled.h1`
  margin: 0;
  ${typographyCss(Typography.display2.bold)}
`;

const Subtitle = styled.p`
  margin: 0;
  ${typographyCss(Typography.heading2.medium)}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
`;

const LoginTextField = styled(TextField)`
  ${applyFieldHeadingCss}
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const LoginButton = styled(Button)`
  width: 100%;
`;

const ResetPasswordButton = styled(TextButton)`
  text-decoration: underline;
`;
