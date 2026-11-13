import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import TextButton from '@common/textButton/TextButton';
import TextField from '@common/textField/TextField';
import PageHeader from '@common/pageHeader/PageHeader';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import ApplyNoticeModal from '@recruit/apply/ApplyNoticeModal';
import { applyFieldHeadingCss } from '@recruit/apply/applyFieldStyle';
import { ApplicantLoginError, ApplicantNotFoundError, SubmittedHistory, loginApplicant } from '@recruit/apply/mock';
import useApplicantSessionStore from 'src/store/useApplicantSessionStore';
import { deriveDraftKey } from '@utils/applyDraft';
import { isUnfilled } from '@utils/index';

export interface ApplicantLoginFormProps {
  title: string;
  isApplyOpen: boolean;
  onSubmittedHistory: (history: SubmittedHistory, email: string) => void;
}

const ApplicantLoginForm = ({ title, isApplyOpen, onSubmittedHistory }: ApplicantLoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginFailed, setIsLoginFailed] = useState(false);
  const [isNoHistoryOpen, setIsNoHistoryOpen] = useState(false);
  const [isNoAccountOpen, setIsNoAccountOpen] = useState(false);
  const setSession = useApplicantSessionStore((state) => state.setSession);

  const loginMutation = useMutation({
    mutationFn: loginApplicant,
    networkMode: 'always',
    onSuccess: async (history, variables) => {
      if (history.status === 'SUBMITTED') return onSubmittedHistory(history, email);
      if (!isApplyOpen) return setIsNoHistoryOpen(true);
      // 작성 중인 계정은 지원서 1단계로 보내고, 이 브라우저에 저장된 내용이 있으면 이어 쓴다
      setSession({
        profile: history.profile,
        draftKey: await deriveDraftKey(history.profile.email, variables.password),
      });
      router.push('/recruit/apply');
    },
    onError: (error) => {
      if (error instanceof ApplicantLoginError) setIsLoginFailed(true);
      if (error instanceof ApplicantNotFoundError) setIsNoAccountOpen(true);
    },
  });

  const canLogin = !isUnfilled(email) && !isUnfilled(password);
  const isRequestFailed =
    loginMutation.isError &&
    !(loginMutation.error instanceof ApplicantLoginError) &&
    !(loginMutation.error instanceof ApplicantNotFoundError);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canLogin) return;
    loginMutation.mutate({ email, password });
  };

  const closeNoHistory = () => setIsNoHistoryOpen(false);

  return (
    <Root>
      <PageHeader
        align="center"
        title={title}
        subtitle={
          <>
            지원서 작성 시 등록한 이메일과 비밀번호로
            <br />
            로그인해 주세요.
          </>
        }
      />
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
          <ResetPasswordButton onClick={() => router.push('/recruit/reset-password')}>
            비밀번호 재설정
          </ResetPasswordButton>
        </Actions>
      </Form>
      {isNoHistoryOpen && (
        <Alert
          heading="제출한 지원서가 없습니다."
          body="서류 접수 기간이 종료되었습니다."
          onDimmerClick={closeNoHistory}
          actions={[{ label: '닫기', variant: 'primary', onClick: closeNoHistory }]}
        />
      )}
      {isNoAccountOpen &&
        (isApplyOpen ? (
          <ApplyNoticeModal
            title="해당 이메일로 가입된 계정이 없습니다."
            description="처음 지원하시는 경우 지원서를 작성해 주세요."
            cancelLabel="닫기"
            confirmLabel="지원서 작성하기"
            onCancel={() => setIsNoAccountOpen(false)}
            onConfirm={() => router.push('/recruit/apply')}
          />
        ) : (
          <Alert
            heading="해당 이메일로 가입된 계정이 없습니다."
            body="서류 접수 기간이 종료되었습니다."
            onDimmerClick={() => setIsNoAccountOpen(false)}
            actions={[{ label: '닫기', variant: 'primary', onClick: () => setIsNoAccountOpen(false) }]}
          />
        ))}
      <ToastWrapper>
        <Toast
          variant="negative"
          text="로그인에 실패했습니다. 다시 시도해주세요"
          show={isRequestFailed}
          onHidden={() => loginMutation.reset()}
        />
      </ToastWrapper>
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
