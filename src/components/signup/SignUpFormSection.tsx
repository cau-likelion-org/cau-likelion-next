import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import TextField from '@common/textField/TextField';
import useInput from 'src/hooks/useInput';
import useListboxSelect from 'src/hooks/useListboxSelect';
import useTokenStore from 'src/store/useTokenStore';
import {
  signUp,
  clearPendingSignupTokens,
  PENDING_SIGNUP_ACCESS_TOKEN_KEY,
  PENDING_SIGNUP_REFRESH_TOKEN_KEY,
  SIGNUP_SUCCESS_FLAG_KEY,
  SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY,
  SignUpMutationProps,
} from 'src/apis/signUp';
import { NUMERIC_ONLY_REGEX, TRACK_INDEX, TRACK_OPTIONS } from '@utils/constant';

const SignUpFormSection = () => {
  const [name, setName] = useState('');
  const [generation, onChangeGeneration] = useInput('', NUMERIC_ONLY_REGEX);
  const [track, setTrack] = useState('');
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [accessToken] = useState(() =>
    typeof window === 'undefined' ? null : sessionStorage.getItem(PENDING_SIGNUP_ACCESS_TOKEN_KEY),
  );
  const [refreshToken] = useState(() =>
    typeof window === 'undefined' ? null : sessionStorage.getItem(PENDING_SIGNUP_REFRESH_TOKEN_KEY),
  );

  const { access } = useTokenStore((state) => state.token);
  const setToken = useTokenStore((state) => state.setToken);
  const router = useRouter();

  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen: isTrackOpen,
    options: TRACK_OPTIONS,
    value: track,
    onOpen: () => setIsTrackOpen(true),
    onClose: () => setIsTrackOpen(false),
    onSelect: setTrack,
  });

  useEffect(() => {
    if (access) {
      router.push('/');
      return;
    }
    if (!accessToken || !refreshToken) {
      router.push('/login');
    }
  }, [router, access, accessToken, refreshToken]);

  const isFormActivated = name.trim() !== '' && generation.trim() !== '' && track !== '';

  const signUpFormPost = useMutation({
    mutationFn: (props: SignUpMutationProps) => signUp(props),
    onSuccess: (res: unknown) => {
      if (res) {
        setToken({ access: accessToken, refresh: refreshToken });
        clearPendingSignupTokens();
        sessionStorage.setItem(SIGNUP_SUCCESS_FLAG_KEY, 'true');
        router.push('/signup/success');
      }
    },
    onError: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      // 4xx만 "사전 미등록 이메일" 업무 오류로 간주. 5xx·네트워크 오류는 폼에 남겨 재시도할 수 있게 함
      if (status !== undefined && status >= 400 && status < 500) {
        clearPendingSignupTokens();
        sessionStorage.setItem(SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY, 'true');
        router.push('/login');
      }
    },
  });

  const handleSubmit = () => {
    if (!isFormActivated || typeof accessToken !== 'string' || typeof refreshToken !== 'string') return;
    signUpFormPost.mutate({
      form: {
        name,
        generation: Number(generation),
        track: TRACK_INDEX[track],
        is_admin: false,
      },
      accessToken,
      refreshToken,
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
              반가워요 아기사자가되신걸 환영합니다!
              <br />
              기본 정보들을 입력해주세요
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
            placeholder="14"
            description="본인의 기수를 숫자로 입력해 주세요."
            value={generation}
            onChange={onChangeGeneration}
          />
          <TrackSelectWrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
            <Select
              ref={triggerRef}
              heading="파트"
              required
              placeholder="선택"
              value={track}
              onClick={() => setIsTrackOpen((prev) => !prev)}
              description="트랙을 선택해 주세요."
              aria-expanded={isTrackOpen}
              aria-activedescendant={isTrackOpen ? `${listId}-${activeIndex}` : undefined}
              aria-controls={listId}
            />
            {isTrackOpen && (
              <ListboxOptions
                listId={listId}
                options={TRACK_OPTIONS}
                value={track}
                activeIndex={activeIndex}
                onSelect={selectOption}
              />
            )}
          </TrackSelectWrapper>
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

const TrackSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SubmitButton = styled(Button)`
  width: 340px;
`;
