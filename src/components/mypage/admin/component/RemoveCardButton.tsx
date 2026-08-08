import Button from '@common/button/Button';
import { IcTrash } from '@assets/svg';

const RemoveCardButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant="outlined"
      color="assistive"
      size="medium"
      trailingIcon={<IcTrash width={18} height={18} />}
      onClick={onClick}
    >
      삭제
    </Button>
  );
};

export default RemoveCardButton;
