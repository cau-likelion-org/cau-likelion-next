import styled from 'styled-components';

import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';

const TITLE = '제출 후에는 수정 및 재제출이 불가합니다.\n제출하시겠습니까?';
const LATE_TITLE = '마감 기한이 초과되어\n평가 시 불이익이 발생할 수 있습니다.\n제출하시겠습니까?';

export interface ApplySubmitModalProps {
  isLate: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplySubmitModal = ({ isLate, loading, onCancel, onConfirm }: ApplySubmitModalProps) => {
  const title = isLate ? LATE_TITLE : TITLE;

  return (
    <Modal ariaLabel={title} onClose={onCancel}>
      <ModalInformation align="center">
        <Title>{title}</Title>
      </ModalInformation>
      <ModalActions>
        <TextButton color="assistive" onClick={onCancel}>
          취소
        </TextButton>
        <TextButton loading={loading} onClick={onConfirm}>
          제출하기
        </TextButton>
      </ModalActions>
    </Modal>
  );
};

export default ApplySubmitModal;

const Title = styled(ModalTitle)`
  white-space: pre-line;
`;
