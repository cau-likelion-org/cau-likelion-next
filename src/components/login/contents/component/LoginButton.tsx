import Button from '@common/button/Button';
import { IcLogoGoogle } from '@assets/svg';
import { trackBeforeUnload } from 'src/lib/amplitude';

const LoginButton = () => {
  const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&response_type=code&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&scope=${process.env.NEXT_PUBLIC_GOOGLE_SCOPE}`;

  const handleClick = () => {
    trackBeforeUnload('Login Started', { button_label: '구글로 로그인하기' });
    window.location.assign(loginUrl);
  };

  return (
    <Button
      variant="solid"
      color="assistive"
      size="large"
      leadingIcon={<IcLogoGoogle width={20} height={20} />}
      onClick={handleClick}
    >
      구글로 로그인하기
    </Button>
  );
};

export default LoginButton;
