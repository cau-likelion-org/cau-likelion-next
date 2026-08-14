import { useState } from 'react';
import styled from 'styled-components';

import { BackgroundWhite, Label, Line, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AssignmentRejectModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

// 제출물 반려 시 사유 입력 모달 (사유 없이는 반려할 수 없음)
const AssignmentRejectModal = ({ onClose, onSubmit }: AssignmentRejectModalProps) => {
  const [reason, setReason] = useState('');
  const canSubmit = reason.trim().length > 0;

  return (
    <Overlay role="dialog" aria-modal="true" aria-label="반려 사유">
      <Dimmer onClick={onClose} />
      <Modal>
        <ModalTitle>반려 사유</ModalTitle>
        <ModalDescription>반려 사유를 입력해 주세요.</ModalDescription>
        <ReasonInput
          autoFocus
          value={reason}
          placeholder="텍스트를 입력해 주세요."
          onChange={(event) => setReason(event.target.value)}
        />
        <ModalActions>
          <ModalButton type="button" onClick={onClose}>
            취소
          </ModalButton>
          <ModalButton type="button" $primary disabled={!canSubmit} onClick={() => onSubmit(reason.trim())}>
            반려
          </ModalButton>
        </ModalActions>
      </Modal>
    </Overlay>
  );
};

export default AssignmentRejectModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  padding: 28px;
  border-radius: 16px;
  background-color: ${BackgroundWhite.primary};
`;

const ModalTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const ModalDescription = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.regular)}
`;

const ReasonInput = styled.textarea`
  height: 80px;
  padding: 12px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  resize: none;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.assistive};
  }

  &:focus {
    outline: none;
    border-color: ${Label.normal};
  }
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$primary ? Orange.o500 : Label.alternative)};
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;
