import { useState } from 'react';
import styled from 'styled-components';

import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import useScrollLock from 'src/hooks/useScrollLock';
import { BackgroundWhite, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AssignmentRejectModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

// 제출물 반려 시 사유 입력 모달 (사유 없이는 반려할 수 없음)
const AssignmentRejectModal = ({ onClose, onSubmit }: AssignmentRejectModalProps) => {
  useScrollLock();

  const [reason, setReason] = useState('');
  const canSubmit = reason.trim().length > 0;

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-label="과제 반려 사유" onDimmerClick={onClose}>
      <Modal>
        <Information>
          <ModalTitle>과제 반려 사유</ModalTitle>
          <ModalDescription>사유를 적어주어야 과제를 반려 처리할 수 있어요</ModalDescription>
          <ReasonInput
            autoFocus
            value={reason}
            placeholder="텍스트를 입력해 주세요."
            onChange={(event) => setReason(event.target.value)}
          />
        </Information>
        <ModalActions>
          <ModalButton type="button" onClick={onClose}>
            취소
          </ModalButton>
          <ModalButton type="button" $primary disabled={!canSubmit} onClick={() => onSubmit(reason.trim())}>
            반려 처리
          </ModalButton>
        </ModalActions>
      </Modal>
    </ModalOverlay>
  );
};

export default AssignmentRejectModal;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${BackgroundWhite.primary};
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`;

const ModalTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.headline1.bold)}
`;

const ModalDescription = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.regular)}
`;

const ReasonInput = styled.textarea`
  box-sizing: border-box;
  height: 80px;
  padding: 12px 16px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  box-shadow: 0 1px 2px -1px rgba(23, 23, 23, 0.1);
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
  padding: 0 20px 12px;
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  position: relative;
  padding: 4px 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$primary ? Orange.o500 : Label.alternative)};
  ${typographyCss(Typography.body1Normal.bold)}

  /* Figma Interaction 레이어 */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -7px;
    right: -7px;
    height: 32px;
    transform: translateY(-50%);
    border-radius: 6px;
    background-color: ${Label.normal};
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:not(:disabled):hover::after {
    opacity: 0.04;
  }

  &:not(:disabled):active::after {
    opacity: 0.08;
  }

  &:disabled {
    color: ${Label.disable};
    cursor: not-allowed;
  }
`;
