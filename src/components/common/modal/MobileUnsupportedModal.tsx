import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import { BackgroundColor, Label, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface MobileUnsupportedModalProps {
  onClose: () => void;
}

// 모바일에서 지원하지 않는 기능을 눌렀을 때 안내하는 알림 모달 (Figma 844:172606)
const MobileUnsupportedModal = ({ onClose }: MobileUnsupportedModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <Dimmer onMouseDown={onClose}>
      <Modal role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <Information>
          <ModalTitle>
            모바일 환경에서 지원하지 않는
            <br />
            기능입니다.
          </ModalTitle>
        </Information>
        <Actions>
          <CloseButton type="button" autoFocus onClick={onClose}>
            닫기
          </CloseButton>
        </Actions>
      </Modal>
    </Dimmer>,
    document.body,
  );
};

export default MobileUnsupportedModal;

const Dimmer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;

  /* Figma: dimmer 색 위에 43% 불투명도를 한 번 더 적용한다 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${Material.dimmer};
    opacity: 0.43;
  }
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  overflow: hidden;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 28px;
`;

const ModalTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0 28px 20px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  padding: 4px 0;
  border: none;
  background: none;
  color: ${Orange.o500};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}
`;
