import styled from 'styled-components';

import Button from '@common/button/Button';
import Modal, { ModalActions, ModalDescription, ModalInformation, ModalTitle } from '@common/modal/Modal';

export interface ApplyNoticeModalProps {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplyNoticeModal = ({
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ApplyNoticeModalProps) => (
  <Modal size="medium" ariaLabel={title} onClose={onCancel}>
    <Information align="center">
      <ModalTitle>{title}</ModalTitle>
      <Description>{description}</Description>
    </Information>
    <Actions>
      <Button variant="outlined" color="assistive" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button onClick={onConfirm}>{confirmLabel}</Button>
    </Actions>
  </Modal>
);

export default ApplyNoticeModal;

const Information = styled(ModalInformation)`
  && {
    gap: 22px;
    padding-bottom: 20px;
  }
`;

// 줄을 나눌 때는 \n을 넣는다
const Description = styled(ModalDescription)`
  white-space: pre-line;
`;

// Figma Action Area(Compact)를 쓰는 모달이라 버튼 줄 여백이 글자 버튼 모달과 다르다
const Actions = styled(ModalActions)`
  && {
    gap: 12px;
    padding: 12px 28px 40px;
  }
`;
