import Button from '@common/button/Button';
import { IcLogoGoogle } from '@assets/svg';
import { trackBeforeUnload } from 'src/lib/amplitude';

interface LoginButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const BUTTON_LABEL = '구글로 로그인하기';

const LoginButton = ({ onClick, loading }: LoginButtonProps) => {
  const handleClick = () => {
    // 클릭 직후 구글 로그인 페이지로 바로 리다이렉트되므로, 일반 전송은 끊길 수 있어 beacon으로 보낸다
    trackBeforeUnload('Login Started', { button_label: BUTTON_LABEL });
    onClick();
  };

  return (
    <Button
      variant="solid"
      color="assistive"
      size="large"
      leadingIcon={<IcLogoGoogle width={20} height={20} />}
      onClick={handleClick}
      loading={loading}
    >
      {BUTTON_LABEL}
    </Button>
  );
};

export default LoginButton;
