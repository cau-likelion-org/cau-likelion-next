import Button from '@common/button/Button';

const RemoveCardButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outlined" color="assistive" size="medium" onClick={onClick}>
      삭제
    </Button>
  );
};

export default RemoveCardButton;
