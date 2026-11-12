import styled from 'styled-components';

import Modal, { ModalActions, ModalDescription, ModalInformation, ModalSize, ModalTitle } from '@common/modal/Modal';
import { Label, Orange, Status } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type AlertActionVariant = 'primary' | 'assistive' | 'negative';

export interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: AlertActionVariant;
  disabled?: boolean;
}

export interface AlertProps {
  className?: string;
  // Figma 모달 규격 (small: 여백 20·Headline 1·모서리 12, medium: 여백 28·Heading 2·모서리 16)
  size?: ModalSize;
  align?: 'left' | 'center';
  // 줄을 나눌 때는 \n을 넣는다
  heading?: string;
  body?: string;
  actions: AlertAction[];
  onDimmerClick?: () => void;
}

const actionColor: Record<AlertActionVariant, string> = {
  primary: Orange.o500,
  assistive: Label.alternative,
  negative: Status.negative,
};

const Alert = ({ className, size = 'small', align = 'left', heading, body, actions, onDimmerClick }: AlertProps) => (
  <Modal className={className} size={size} ariaLabel={heading ?? body ?? ''} onClose={onDimmerClick ?? (() => {})}>
    <Information align={align} $size={size}>
      {heading && <Heading>{heading}</Heading>}
      {body && <ModalDescription>{body}</ModalDescription>}
    </Information>
    <ModalActions>
      {actions.map((action) => (
        <ActionButton
          key={action.label}
          type="button"
          color={action.disabled ? Label.disable : actionColor[action.variant ?? 'assistive']}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </ActionButton>
      ))}
    </ModalActions>
  </Modal>
);

export default Alert;

// 제목과 본문 사이 간격 (Figma Alert/Resource/Dialog: small 6px, medium 8px)
const Information = styled(ModalInformation)<{ $size: ModalSize }>`
  && {
    gap: ${(props) => (props.$size === 'small' ? 6 : 8)}px;
  }
`;

const Heading = styled(ModalTitle)`
  white-space: pre-line;
`;

const ActionButton = styled.button<{ color: string }>`
  position: relative;
  padding: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.color};
  ${typographyCss(Typography.body1Normal.bold)}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -7px;
    right: -7px;
    height: 32px;
    transform: translateY(-50%);
    border-radius: 6px;
    background-color: currentColor;
    opacity: 0;
    pointer-events: none;
  }

  &:disabled {
    cursor: default;
  }

  &:not(:disabled):hover::before {
    opacity: 0.08;
  }
`;
