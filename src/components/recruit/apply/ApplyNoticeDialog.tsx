import { useRef } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useScrollLock from 'src/hooks/useScrollLock';
import { BackgroundWhite, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface ApplyNoticeDialogProps {
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplyNoticeDialog = ({
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ApplyNoticeDialogProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onCancel);
  useScrollLock();

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-label={title} onDimmerClick={onCancel}>
      <Modal ref={modalRef} tabIndex={-1}>
        <Information>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Information>
        <Actions>
          <Button variant="outlined" color="assistive" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </Actions>
      </Modal>
    </ModalOverlay>
  );
};

export default ApplyNoticeDialog;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${BackgroundWhite.primary};
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 28px 28px 20px;
  text-align: center;
  word-break: keep-all;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Description = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.regular)}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 28px 40px;
`;
