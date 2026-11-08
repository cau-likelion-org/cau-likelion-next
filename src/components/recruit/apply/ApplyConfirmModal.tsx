import styled from 'styled-components';

import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';
import { Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TITLE = '작성한 기본 정보는 수정할 수 없습니다.\n아래 정보로 진행하시겠습니까?';

export interface ApplyConfirmModalProps {
  name: string;
  phone: string;
  email: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplyConfirmModal = ({ name, phone, email, loading, onCancel, onConfirm }: ApplyConfirmModalProps) => {
  const rows = [
    { label: '이름', value: name },
    { label: '전화번호', value: phone },
    { label: '이메일', value: email },
  ];

  return (
    <Modal size="medium" ariaLabel={TITLE} onClose={onCancel}>
      <Information align="center">
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
  );
};

export default ApplyConfirmModal;

// Figma 지원서 정보 확인 모달은 좌우 여백이 20px로 medium 규격보다 좁다
const Information = styled(ModalInformation)`
  && {
    gap: 22px;
    padding: 28px 20px 20px;
  }
`;

const Title = styled(ModalTitle)`
  white-space: pre-line;
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

const Actions = styled(ModalActions)`
  && {
    padding: 0 20px 12px;
  }
`;
