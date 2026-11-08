import { useState } from 'react';
import styled from 'styled-components';

import Modal, { ModalActions, ModalDescription, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';
import { Label, Line } from '@utils/constant/color';
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
    <Modal ariaLabel="과제 반려 사유" onClose={onClose}>
      <Information>
        <ModalTitle>과제 반려 사유</ModalTitle>
        <ModalDescription>사유를 적어주어야 과제를 반려 처리할 수 있어요</ModalDescription>
        <ReasonInput
          value={reason}
          placeholder="텍스트를 입력해 주세요."
          onChange={(event) => setReason(event.target.value)}
        />
      </Information>
      <ModalActions>
        <TextButton color="assistive" onClick={onClose}>
          취소
        </TextButton>
        <TextButton disabled={!canSubmit} onClick={() => onSubmit(reason.trim())}>
          반려 처리
        </TextButton>
      </ModalActions>
    </Modal>
  );
};

export default AssignmentRejectModal;

const Information = styled(ModalInformation)`
  && {
    gap: 12px;
  }
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
