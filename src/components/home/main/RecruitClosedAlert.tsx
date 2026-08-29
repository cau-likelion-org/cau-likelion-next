import { useId, useRef } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ScrollArea from '@common/scrollArea/ScrollArea';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundColor, Label, Material } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface RecruitClosedAlertProps {
  onClose: () => void;
  onConfirm: () => void;
}

const RecruitClosedAlert = ({ onClose, onConfirm }: RecruitClosedAlertProps) => {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

  return (
    <Backdrop onClick={onClose}>
      <Modal
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <InformationScroll>
          <Information>
            <Title id={titleId}>
              아직 지원 기간이 아닙니다.
              <br />
              리크루팅 사전 알림 신청을 하시겠습니까?
            </Title>
          </Information>
        </InformationScroll>
        <Actions>
          <Button variant="outlined" color="assistive" size="medium" onClick={onClose}>
            취소
          </Button>
          <Button variant="solid" color="primary" size="medium" onClick={onConfirm}>
            사전알림 신청하기
          </Button>
        </Actions>
      </Modal>
    </Backdrop>
  );
};

export default RecruitClosedAlert;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Material.dimmer};
  z-index: 9999;
`;

const Modal = styled.div`
  width: 400px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  overflow: hidden;
  outline: none;
  z-index: 10000;
`;

const InformationScroll = styled(ScrollArea)``;

const Information = styled.div`
  padding: 28px;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 28px 20px;
`;
