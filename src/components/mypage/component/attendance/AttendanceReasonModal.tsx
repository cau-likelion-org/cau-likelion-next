import { useState } from 'react';
import styled from 'styled-components';

import Modal, { ModalActions, ModalDescription, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AttendanceReasonModalProps {
  initialReason?: string;
  onClose: () => void;
  onSave: (reason: string) => void;
}

const toSingleLine = (value: string) => value.replace(/[\r\n]+/g, ' ');

// 결석·공결로 변경 시 사유 입력 모달 (Figma 8.3.5)
const AttendanceReasonModal = ({ initialReason = '', onClose, onSave }: AttendanceReasonModalProps) => {
  const [reason, setReason] = useState(initialReason);

  const canSave = reason.trim().length > 0;

  return (
    <Modal ariaLabel="출석 수정사유" onClose={onClose}>
      <Information>
        <ModalTitle>출석 수정사유</ModalTitle>
        <ModalDescription>사유를 적어주어야 출석을 수정할 수 있어요</ModalDescription>
        <ReasonInput
          value={reason}
          placeholder="텍스트를 입력해 주세요."
          onChange={(event) => setReason(toSingleLine(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing) event.preventDefault();
          }}
        />
      </Information>
      <ModalActions>
        <TextButton color="assistive" onClick={onClose}>
          닫기
        </TextButton>
        <TextButton disabled={!canSave} onClick={() => onSave(reason.trim())}>
          저장
        </TextButton>
      </ModalActions>
    </Modal>
  );
};

export default AttendanceReasonModal;

const Information = styled(ModalInformation)`
  && {
    gap: 12px;
  }
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
