import Button from '@common/button/Button';

const EditButton = ({ onClick, disabled = false }: { onClick: () => void; disabled?: boolean }) => {
  return (
    <Button variant="outlined" color="assistive" size="small" onClick={onClick} disabled={disabled}>
      수정
    </Button>
  );
};

export default EditButton;
