import styled from 'styled-components';
import { HiXMark } from 'react-icons/hi2';

import { BackgroundColor, Inverse, System } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface SnackbarProps {
  className?: string;
  text: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

const Snackbar = ({ className, text, description, icon, actionLabel, onAction, onClose }: SnackbarProps) => {
  return (
    <Container className={className}>
      <Content>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <Message>
          <Heading>{text}</Heading>
          {description && <Description>{description}</Description>}
        </Message>
      </Content>
      {actionLabel && (
        <ActionButton type="button" onClick={onAction}>
          {actionLabel}
        </ActionButton>
      )}
      {onClose && (
        <CloseButton type="button" onClick={onClose} aria-label="닫기">
          <HiXMark />
        </CloseButton>
      )}
    </Container>
  );
};

export default Snackbar;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 32px;
  width: fit-content;
  max-width: 420px;
  padding: 11px 16px;
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
  }

  &::before {
    background-color: ${Inverse.background};
    opacity: 0.52;
  }

  &::after {
    background-color: ${System.blue};
    opacity: 0.05;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const IconWrapper = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Message = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 5px 2px;
  color: ${BackgroundColor};
`;

const Heading = styled.p`
  margin: 0;
  opacity: 0.88;
  ${typographyCss(Typography.body2Normal.bold)}
`;

const Description = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.88;
  ${typographyCss(Typography.label2.regular)}
`;

const ActionButton = styled.button`
  flex-shrink: 0;
  padding: 4px 2px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${BackgroundColor};
  white-space: nowrap;
  ${typographyCss(Typography.body2Normal.bold)}
`;

const CloseButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: ${BackgroundColor};
  opacity: 0.61;

  svg {
    width: 100%;
    height: 100%;
  }
`;
