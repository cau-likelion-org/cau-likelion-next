import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import TextField from '@common/textField/TextField';
import useListboxSelect from 'src/hooks/useListboxSelect';
import useTokenStore from 'src/store/useTokenStore';
import { getGenerations } from 'src/apis/account';
import {
  signUp,
  clearPendingSignupToken,
  PENDING_SIGNUP_TOKEN_KEY,
  PENDING_SIGNUP_ATTEMPT_ID_KEY,
  SIGNUP_SUCCESS_FLAG_KEY,
  SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY,
} from 'src/apis/signUp';
import { excludeCommonPart, isUnfilled } from '@utils/index';
import { track, newAttemptId } from 'src/lib/amplitude';

type OpenField = 'part' | null;

const classifyFailureReason = (error: unknown): 'validation_error' | 'network_error' | 'server_error' => {
  if (!axios.isAxiosError(error) || !error.response) return 'network_error';
  return error.response.status >= 500 ? 'server_error' : 'validation_error';
};

const SignUpFormSection = () => {
  const [name, setName] = useState('');
  const [partName, setPartName] = useState('');
  const [openField, setOpenField] = useState<OpenField>(null);
  const [signupToken] = useState(() =>
    typeof window === 'undefined' ? null : sessionStorage.getItem(PENDING_SIGNUP_TOKEN_KEY),
  );
  // 로그인 페이지의 Signup Required에서 발급한 id를 그대로 이어받아, 이 방문의 제출·실패·완료를 묶는다.
  // 못 받아온 경우(세션스토리지 유실 등)를 대비해 여기서라도 새로 발급한다.
  const [attemptSessionId] = useState(
    () =>
      (typeof window === 'undefined' ? '' : sessionStorage.getItem(PENDING_SIGNUP_ATTEMPT_ID_KEY)) || newAttemptId(),
  );
  const attemptNumberRef = useRef(0);

  const setToken = useTokenStore((state) => state.setToken);
  const router = useRouter();

  const { data: generations } = useQuery({
    queryKey: ['generations'],
    queryFn: getGenerations,
  });

  // 기수는 더 이상 사용자가 선택하지 않고, 운영진이 Admin에서 지정한 현재 기수로 고정
  const activeGeneration = useMemo(
    () => generations?.find((g) => g.status === 'IN_ACTIVITY') ?? generations?.[generations.length - 1],
    [generations],
  );
  const partOptions = useMemo(
    () => excludeCommonPart(activeGeneration?.parts ?? []).map((p) => p.name),
    [activeGeneration],
  );

  const {
    listId: partListId,
    wrapperRef: partWrapperRef,
    triggerRef: partTriggerRef,
    activeIndex: partActiveIndex,
    handleKeyDown: handlePartKeyDown,
    handleBlur: handlePartBlur,
    selectOption: selectPartOption,
  } = useListboxSelect({
    isOpen: openField === 'part',
    options: partOptions,
    value: partName,
    onOpen: () => setOpenField('part'),
    onClose: () => setOpenField(null),
    onSelect: (option) => {
      setPartName(option);
      setOpenField(null);
    },
  });

  useEffect(() => {
    if (!signupToken) {
      router.push('/login');
    }
  }, [router, signupToken]);

  const selectedPart = activeGeneration?.parts.find((p) => p.name === partName);
  const isFormActivated = !isUnfilled(name) && !!activeGeneration && !!selectedPart;

  const signUpFormPost = useMutation({
    mutationFn: signUp,
    onSuccess: (res) => {
      track('Login Completed', { login_method: 'google', is_new_signup: true, attempt_session_id: attemptSessionId });
      setToken({ access: res.accessToken, refresh: res.refreshToken });
      clearPendingSignupToken();
      sessionStorage.setItem(SIGNUP_SUCCESS_FLAG_KEY, 'true');
      router.push('/signup/success');
    },
    onError: (error) => {
      track('Signup Failed', {
        attempt_session_id: attemptSessionId,
        attempt_number: attemptNumberRef.current,
        failure_reason: classifyFailureReason(error),
      });
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      // 4xx만 "사전 미등록 이메일" 업무 오류로 간주. 5xx·네트워크 오류는 폼에 남겨 재시도할 수 있게 함
      if (status !== undefined && status >= 400 && status < 500) {
        clearPendingSignupToken();
        sessionStorage.setItem(SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY, 'true');
        router.push('/login');
      }
    },
  });

  const handleSubmit = () => {
    if (!isFormActivated || !activeGeneration || !selectedPart || typeof signupToken !== 'string') return;
    attemptNumberRef.current += 1;
    track('Signup Submitted', { attempt_session_id: attemptSessionId, attempt_number: attemptNumberRef.current });
    signUpFormPost.mutate({
      signupToken,
      name,
      generationId: activeGeneration.id,
      partId: selectedPart.id,
    });
  };

  return (
    <Wrapper>
      <ContentGroup>
        <Header
          align="center"
          title="회원가입"
          subtitle={
            <>
              반가워요, 아기사자 여러분!
              <br />
              기본 정보를 입력해주세요.
            </>
          }
        />
        <FieldGroup>
          <TextField
            heading="이름"
            required
            placeholder="홍길동"
            description="실명으로 입력해 주세요."
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            heading="기수"
            required
            disabled
            readOnly
            value={activeGeneration ? String(activeGeneration.number) : ''}
            description="수정이 필요한 경우 운영진에게 문의해주세요."
          />
          <SelectWrapper ref={partWrapperRef} onKeyDownCapture={handlePartKeyDown} onBlur={handlePartBlur}>
            <Select
              ref={partTriggerRef}
              heading="파트"
              required
              placeholder="선택"
              value={partName}
              onClick={() => setOpenField((prev) => (prev === 'part' ? null : 'part'))}
              description="파트를 선택해 주세요."
              disabled={!activeGeneration}
              aria-expanded={openField === 'part'}
              aria-activedescendant={openField === 'part' ? `${partListId}-${partActiveIndex}` : undefined}
              aria-controls={partListId}
            >
              {openField === 'part' && (
                <ListboxOptions
                  listId={partListId}
                  options={partOptions}
                  value={partName}
                  activeIndex={partActiveIndex}
                  onSelect={selectPartOption}
                />
              )}
            </Select>
          </SelectWrapper>
        </FieldGroup>
      </ContentGroup>
      <SubmitButton
        variant="solid"
        color="primary"
        size="large"
        disabled={!isFormActivated}
        loading={signUpFormPost.isPending}
        onClick={handleSubmit}
      >
        회원가입
      </SubmitButton>
    </Wrapper>
  );
};

export default SignUpFormSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 78px;
  width: 520px;
  max-width: 100%;
`;

const ContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 62px;
  width: 100%;
`;

const Header = styled(PageHeader)`
  gap: 24px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 39px;
  width: 100%;
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SubmitButton = styled(Button)`
  width: 340px;
`;
