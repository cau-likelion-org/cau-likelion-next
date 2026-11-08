import { useRef } from 'react';
import styled from 'styled-components';

import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import TextButton from '@common/textButton/TextButton';
import useFocusTrap from 'src/hooks/useFocusTrap';
import useScrollLock from 'src/hooks/useScrollLock';
import { BackgroundWhite, Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TITLE = '작성한 기본 정보는 수정할 수 없습니다.\n아래 정보로 진행하시겠습니까?';

export interface ApplyConfirmDialogProps {
  name: string;
  phone: string;
  email: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplyConfirmDialog = ({ name, phone, email, loading, onCancel, onConfirm }: ApplyConfirmDialogProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onCancel);
  useScrollLock();

  const rows = [
    { label: '이름', value: name },
    { label: '전화번호', value: phone },
    { label: '이메일', value: email },
  ];

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-label={TITLE} onDimmerClick={onCancel}>
      <Modal ref={modalRef} tabIndex={-1}>
        <Information>
          <Title>{TITLE}</Title>
          <InfoBox>
            {rows.map(({ label, value }) => (
              <InfoRow key={label}>
                <InfoLabel>{label}</InfoLabel>
                <InfoValue>{value}</InfoValue>
              </InfoRow>
            ))}
          </InfoBox>
        </Information>
        <Actions>
          <TextButton color="assistive" onClick={onCancel}>
            취소
          </TextButton>
          <TextButton loading={loading} onClick={onConfirm}>
            확인
          </TextButton>
        </Actions>
      </Modal>
    </ModalOverlay>
  );
};

export default ApplyConfirmDialog;

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
  padding: 28px 20px 20px;
`;

const Title = styled.p`
  margin: 0;
  white-space: pre-line;
  text-align: center;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const InfoBox = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin: 0;
  padding: 14px 12px;
  border-radius: 8px;
  background-color: ${Fill.subtle};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const InfoLabel = styled.dt`
  flex-shrink: 0;
  width: 72px;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const InfoValue = styled.dd`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  word-break: break-all;
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 20px 12px;
`;
