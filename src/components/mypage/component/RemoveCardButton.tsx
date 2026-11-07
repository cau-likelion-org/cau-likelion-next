import Button from '@common/button/Button';
import { IcTrash } from '@assets/svg';

const RemoveCardButton = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => {
  return (
    <Button
      variant="solid"
      color="assistive"
      size="medium"
      trailingIcon={<IcTrash width={18} height={18} />}
      onClick={onClick}
      disabled={disabled}
    >
      삭제
    </Button>
  );
};

export default RemoveCardButton;
