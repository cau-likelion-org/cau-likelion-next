import { TRACK, TRACK_INDEX, TRACK_NAME } from '@utils/constant';
import { Basic } from '@utils/constant/color';
import { isEmptyString } from '@utils/index';
import { token } from '@utils/state';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState } from 'recoil';
import { signUp, SignUpMutationProps } from 'src/apis/signUp';
import useInput from 'src/hooks/useInput';
import styled from 'styled-components';
import CauMailAuthenticationBox from './component/CauMailAuthenticationBox';
import DropdownMenuBox from './component/DropdownMenuBox';
import FormSendButton from './component/FormSendButton';
import TextInputBox from './component/TextInputBox';
import ToggleBox from './component/ToggleBox';
import cookie from "react-cookies";

const SignUpFormSection = () => {
  const track = [TRACK_NAME[TRACK.PM], TRACK_NAME[TRACK.DESIGN], TRACK_NAME[TRACK.FRONTEND], TRACK_NAME[TRACK.BACKEND]];
  const [nameValue, onChangeName] = useInput('');
  const [generationValue, onChangeGeneration] = useInput('', /^[0-9]*$/);
  const [emailValue, onChangeEmail] = useInput('');
  const [emailSecretValue, onChangeEmailSecret] = useInput('');
  const [toggleIsClicked, setToggleIsClicked] = useState([true, false]);
  const [dropdownValue, setDropdownValue] = useState(track[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFormActivated, setIsFormActivated] = useState(false);
  const [{ access, refresh }, setToken] = useRecoilState(token);
  const router = useRouter();
  const { accessToken, refreshToken } = router.query;

  useEffect(() => {
    if (access) {
      router.push('/');
    }
    if (access == '' && !accessToken) {
      router.push('/login');
    }
    if (
      !isEmptyString(nameValue) &&
      !isEmptyString(generationValue) &&
      !isEmptyString(emailValue) &&
      !isEmptyString(emailSecretValue) &&
      isAuthenticated
    )
      setIsFormActivated(true);
    else setIsFormActivated(false);
  }, [nameValue, generationValue, emailValue, emailSecretValue, isAuthenticated]);

  const signUpFormPost = useMutation({
    mutationFn: (props: SignUpMutationProps) => signUp(props),
    onSuccess: (res: any) => {
      if (res) {
        setToken((prev) => {
          const obj = { ...prev };
          obj.access = accessToken as string;
          obj.refresh = refreshToken as string;
          return obj;
        });
        cookie.save('access', accessToken as string, { path: '/' });
        cookie.save('refresh', refreshToken as string, { path: '/' });
        router.push('/signup/success');
      }
    },
  });

  const handleSubmit = () => {
    if (isFormActivated && accessToken) {
      signUpFormPost.mutate({
        form: {
          name: nameValue,
          generation: Number(generationValue),
          track: TRACK_INDEX[dropdownValue],
          is_admin: toggleIsClicked[1],
        },
        accessToken,
        refreshToken,
      } as SignUpMutationProps);
    }
  };

  return (
    <>
      <FormWrapper>
        <TextInputBox
          title={'이름'}
          description={'실명으로 입력해주세요.'}
          placeholder={'중하하'}
          value={nameValue}
          onChange={onChangeName}
        />
        <TextInputBox
          title={'기수'}
          description={'마지막 활동 기수를 숫자로 입력해주세요.'}
          placeholder={'11'}
          value={generationValue}
          onChange={onChangeGeneration}
        />
        <DropdownMenuBox
          title={'파트'}
          menu={track}
          description={'트랙을 선택해주세요'}
          selectedMenu={dropdownValue}
          setSelectedMenu={setDropdownValue}
        />
        <ToggleBox
          title={'일반회원/운영진'}
          toggle={toggleIsClicked}
          setToggle={setToggleIsClicked}
          description={'현 기수 운영진을 제외한 이전 기수 운영진과 기타 회원은 일반회원을 선택해 주세요.'}
        />
        <CauMailAuthenticationBox
          title={'중앙대학교 메일 인증'}
          emailValue={emailValue}
          onChangeEmail={onChangeEmail}
          secretValue={emailSecretValue}
          onChangeSecret={onChangeEmailSecret}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          accessTokenOnce={accessToken as string}
          refreshTokenOnce={refreshToken as string}
        />
      </FormWrapper>
      <FormSendButton isActive={isFormActivated} handleSubmit={handleSubmit} buttonTitle={'회원가입'} />
    </>
  );
};

export default SignUpFormSection;

const FormWrapper = styled.div`
  margin-top: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 2px solid ${Basic.default};
  border-bottom: 2px solid ${Basic.default};
`;
