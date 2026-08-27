import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import useScrollLock from 'src/hooks/useScrollLock';
import { BackgroundColor, Label, Line, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AttendanceReasonModalProps {
  initialReason?: string;
  onClose: () => void;
  onSave: (reason: string) => void;
}

const toSingleLine = (value: string) => value.replace(/[\r\n]+/g, ' ');

// 결석·공결로 변경 시 사유 입력 모달 (Figma 8.3.5)
const AttendanceReasonModal = ({ initialReason = '', onClose, onSave }: AttendanceReasonModalProps) => {
  useScrollLock();

  const [reason, setReason] = useState(initialReason);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const canSave = reason.trim().length > 0;

  return createPortal(
    <Dimmer onMouseDown={onClose}>
      <Modal
        role="dialog"
        aria-modal="true"
        aria-label="출석 수정사유"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Information>
          <ModalTitle>출석 수정사유</ModalTitle>
          <ModalDescription>사유를 적어주어야 출석을 수정할 수 있어요</ModalDescription>
          <ReasonInput
            autoFocus
            value={reason}
            placeholder="텍스트를 입력해 주세요."
            onChange={(event) => setReason(toSingleLine(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.nativeEvent.isComposing) event.preventDefault();
            }}
          />
        </Information>
        <Actions>
          <CloseButton type="button" onClick={onClose}>
            닫기
          </CloseButton>
          <SaveButton type="button" disabled={!canSave} onClick={() => onSave(reason.trim())}>
            저장
          </SaveButton>
        </Actions>
      </Modal>
    </Dimmer>,
    document.body,
  );
};

export default AttendanceReasonModal;

const Dimmer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Material.dimmer};
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  max-width: calc(100vw - 40px);
  border-radius: 12px;
  background-color: ${BackgroundColor};
  overflow: hidden;
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
  height: 80px;
  padding: 12px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  box-shadow: 0px 1px 2px -1px rgba(23, 23, 23, 0.1);
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

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 20px 12px;
`;

const CloseButton = styled.button`
  padding: 4px;
  border: none;
  background: none;
  color: ${Label.alternative};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}
`;

const SaveButton = styled.button`
  padding: 4px;
  border: none;
  background: none;
  color: ${Orange.o500};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;
