import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import Button from '@common/button/Button';
import { IcLogoGoogle } from '@assets/svg';
import useTokenStore from 'src/store/useTokenStore';
import useGoogleIdentity from 'src/hooks/useGoogleIdentity';
import { googleLogin } from 'src/apis/account';
import { PENDING_SIGNUP_TOKEN_KEY } from 'src/apis/signUp';

interface LoginButtonProps {
  onUnregistered: () => void;
}

const LoginButton = ({ onUnregistered }: LoginButtonProps) => {
  const router = useRouter();
  const setToken = useTokenStore((state) => state.setToken);

  const loginMutation = useMutation({
    mutationFn: (idToken: string) => googleLogin(idToken),
    onSuccess: (res) => {
      if (res.status === 'SIGNUP_REQUIRED') {
        sessionStorage.setItem(PENDING_SIGNUP_TOKEN_KEY, res.signupToken);
        router.push('/signup');
        return;
      }
      setToken({ access: res.tokens.accessToken, refresh: res.tokens.refreshToken });
    },
    onError: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      // 4xx(EMAIL_NOT_ALLOWED)만 "미가입 이메일" 업무 오류로 간주. 5xx·네트워크 오류는 조용히 무시
      if (status !== undefined && status >= 400 && status < 500) {
        onUnregistered();
      }
    },
  });

  const { promptLogin } = useGoogleIdentity((idToken) => loginMutation.mutate(idToken));

  return (
    <Button
      variant="solid"
      color="assistive"
      size="large"
      leadingIcon={<IcLogoGoogle width={20} height={20} />}
      onClick={promptLogin}
      loading={loginMutation.isPending}
    >
      구글로 로그인하기
    </Button>
  );
};

export default LoginButton;
