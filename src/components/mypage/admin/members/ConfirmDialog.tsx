import styled from 'styled-components';

import useScrollLock from 'src/hooks/useScrollLock';
import { BackgroundWhite, Label, Material, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface ConfirmDialogProps {
  title: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({ title, confirmLabel = '삭제', onCancel, onConfirm }: ConfirmDialogProps) => {
  useScrollLock();

  return (
    <Overlay role="alertdialog" aria-modal="true" aria-label={title}>
      <Dimmer onClick={onCancel} />
      <Modal>
        <Information>
          <Title>{title}</Title>
        </Information>
        <Actions>
          <TextButton type="button" onClick={onCancel}>
            취소
          </TextButton>
          <TextButton type="button" $primary onClick={onConfirm}>
            {confirmLabel}
          </TextButton>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default ConfirmDialog;

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
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${BackgroundWhite.primary};
`;

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

const TextButton = styled.button<{ $primary?: boolean }>`
  position: relative;
  padding: 4px 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$primary ? Orange.o500 : Label.alternative)};
  ${typographyCss(Typography.body1Normal.bold)}

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

  &:hover::after {
    opacity: 0.04;
  }

  &:active::after {
    opacity: 0.08;
  }
`;
