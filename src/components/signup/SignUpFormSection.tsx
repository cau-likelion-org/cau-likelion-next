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
import LocalStorage from '@utils/localStorage';

const SignUpFormSection = () => {
  const track = [TRACK_NAME[TRACK.PM], TRACK_NAME[TRACK.DESIGN], TRACK_NAME[TRACK.FRONTEND], TRACK_NAME[TRACK.BACKEND], TRACK_NAME[TRACK.ETC]];
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
        LocalStorage.setItem('access', accessToken as string);
        LocalStorage.setItem('refresh', refreshToken as string);
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
          title={'??????'}
          description={'???????????? ??????????????????.'}
          placeholder={'?????????'}
          value={nameValue}
          onChange={onChangeName}
        />
        <TextInputBox
          title={'??????'}
          description={'????????? ?????? ????????? ????????? ??????????????????.'}
          placeholder={'????????? ??????????????????.'}
          value={generationValue}
          onChange={onChangeGeneration}
        />
        <DropdownMenuBox
          title={'??????'}
          menu={track}
          description={'????????? ??????????????????'}
          selectedMenu={dropdownValue}
          setSelectedMenu={setDropdownValue}
        />
        <ToggleBox
          title={'????????????/?????????'}
          toggle={toggleIsClicked}
          setToggle={setToggleIsClicked}
          description={'??? ?????? ???????????? ????????? ?????? ?????? ???????????? ?????? ????????? ??????????????? ????????? ?????????.'}
        />
        <CauMailAuthenticationBox
          title={'??????????????? ?????? ??????'}
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
      <FormSendButton isActive={isFormActivated} handleSubmit={handleSubmit} buttonTitle={'????????????'} />
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
