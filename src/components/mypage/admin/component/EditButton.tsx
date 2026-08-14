import Button from '@common/button/Button';

const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button variant="outlined" color="assistive" size="small" onClick={onClick}>
      수정
    </Button>
  );
};

export default EditButton;
