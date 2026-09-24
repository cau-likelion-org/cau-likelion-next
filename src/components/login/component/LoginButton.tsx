import Button from '@common/button/Button';
import { IcLogoGoogle } from '@assets/svg';
import { track } from 'src/lib/amplitude';

interface LoginButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const BUTTON_LABEL = '구글로 로그인하기';

const LoginButton = ({ onClick, loading }: LoginButtonProps) => {
  const handleClick = () => {
    track('Login Started', { button_label: BUTTON_LABEL });
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
