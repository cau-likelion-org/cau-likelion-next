import styled, { css } from 'styled-components';

import { BackgroundColor, Label, Material, Orange, Status } from '@utils/constant/color';
import { Typography } from '@utils/constant/typography';

export type AlertActionVariant = 'primary' | 'assistive' | 'negative';

export interface AlertAction {
  label: string;
  onClick: () => void;
  variant?: AlertActionVariant;
}

export interface AlertProps {
  className?: string;
  heading?: string;
  body: string;
  actions: AlertAction[];
  onDimmerClick?: () => void;
}

const actionColor: Record<AlertActionVariant, string> = {
  primary: Orange.o500,
  assistive: Label.alternative,
  negative: Status.negative,
};

const Alert = ({ className, heading, body, actions, onDimmerClick }: AlertProps) => {
  return (
    <Overlay className={className} role="dialog" aria-modal="true">
      <Dimmer onClick={onDimmerClick} />
      <Modal>
        <Information>
          {heading && <Heading>{heading}</Heading>}
          <Body>{body}</Body>
        </Information>
        <Actions>
          {actions.map((action) => (
            <ActionButton
              key={action.label}
              type="button"
              color={actionColor[action.variant ?? 'assistive']}
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default Alert;

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
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  background-color: ${BackgroundColor};
  border-radius: 12px;
  overflow: hidden;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  word-break: break-word;
`;

const Heading = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${() => {
    const token = Typography.headline1.bold;
    return css`
      font-family: ${token.fontFamily};
      font-weight: ${token.fontWeight};
      font-size: ${token.fontSize};
      line-height: ${token.lineHeight};
      letter-spacing: ${token.letterSpacing};
    `;
  }}
`;

const Body = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${() => {
    const token = Typography.body2Normal.regular;
    return css`
      font-family: ${token.fontFamily};
      font-weight: ${token.fontWeight};
      font-size: ${token.fontSize};
      line-height: ${token.lineHeight};
      letter-spacing: ${token.letterSpacing};
    `;
  }}
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 20px 12px;
`;

const ActionButton = styled.button<{ color: string }>`
  position: relative;
  padding: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.color};
  ${() => {
    const token = Typography.body1Normal.bold;
    return css`
      font-family: ${token.fontFamily};
      font-weight: ${token.fontWeight};
      font-size: ${token.fontSize};
      line-height: ${token.lineHeight};
      letter-spacing: ${token.letterSpacing};
    `;
  }}

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

  &:hover::before {
    opacity: 0.08;
  }
`;
