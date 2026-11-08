import { useRef } from 'react';
import styled from 'styled-components';

import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import TextButton from '@common/textButton/TextButton';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useScrollLock from 'src/hooks/useScrollLock';
import { BackgroundWhite, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TITLE = '제출 후에는 수정 및 재제출이 불가합니다.\n제출하시겠습니까?';
const LATE_TITLE = '마감 기한이 초과되어\n평가 시 불이익이 발생할 수 있습니다.\n제출하시겠습니까?';

export interface ApplySubmitDialogProps {
  isLate: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplySubmitDialog = ({ isLate, loading, onCancel, onConfirm }: ApplySubmitDialogProps) => {
  const title = isLate ? LATE_TITLE : TITLE;
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onCancel);
  useScrollLock();

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-label={title} onDimmerClick={onCancel}>
      <Modal ref={modalRef} tabIndex={-1}>
        <Title>{title}</Title>
        <Actions>
          <TextButton color="assistive" onClick={onCancel}>
            취소
          </TextButton>
          <TextButton loading={loading} onClick={onConfirm}>
            제출하기
          </TextButton>
        </Actions>
      </Modal>
    </ModalOverlay>
  );
};

export default ApplySubmitDialog;

const Modal = styled.div`
  position: relative;
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${BackgroundWhite.primary};
`;

const Title = styled.p`
  margin: 0;
  padding: 20px;
  white-space: pre-line;
  text-align: center;
  word-break: keep-all;
  color: ${Label.normal};
  ${typographyCss(Typography.headline1.bold)}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 20px 12px;
`;
