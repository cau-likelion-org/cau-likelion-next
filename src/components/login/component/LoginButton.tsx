import Button from '@common/button/Button';
import { IcLogoGoogle } from '@assets/svg';

interface LoginButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const LoginButton = ({ onClick, loading }: LoginButtonProps) => {
  return (
    <Button
      variant="solid"
      color="assistive"
      size="large"
      leadingIcon={<IcLogoGoogle width={20} height={20} />}
      onClick={onClick}
      loading={loading}
    >
      구글로 로그인하기
    </Button>
  );
};

export default LoginButton;
