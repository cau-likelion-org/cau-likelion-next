import styled, { css } from 'styled-components';
import { FunctionComponent, SVGProps } from 'react';

import { IcCircleCheck, IcCircleExclamation, IcTriangleExclamation } from '@assets/svg';
import { BackgroundColor, Black, FeedbackStatus, System } from '@utils/constant/color';
import { Typography } from '@utils/constant/typography';

export type ToastVariant = 'normal' | 'positive' | 'cautionary' | 'negative';

export interface ToastProps {
  className?: string;
  variant?: ToastVariant;
  text: string;
  icon?: React.ReactNode;
}

const statusIcon: Record<
  'positive' | 'cautionary' | 'negative',
  { Icon: FunctionComponent<SVGProps<SVGSVGElement>>; color: string }
> = {
  positive: { Icon: IcCircleCheck, color: FeedbackStatus.positive },
  cautionary: { Icon: IcTriangleExclamation, color: FeedbackStatus.cautionary },
  negative: { Icon: IcCircleExclamation, color: FeedbackStatus.negative },
};

const Toast = ({ className, variant = 'normal', text, icon }: ToastProps) => {
  const status = variant === 'normal' ? null : statusIcon[variant];

  return (
    <Container className={className}>
      {status && (
        <IconWrapper color={status.color}>
          <status.Icon />
        </IconWrapper>
      )}
      {variant === 'normal' && icon && <IconWrapper>{icon}</IconWrapper>}
      <Text>{text}</Text>
    </Container>
  );
};

export default Toast;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
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
    background-color: ${Black.b800};
    opacity: 0.52;
  }

  &::after {
    background-color: ${System.blue};
    opacity: 0.05;
  }
`;

const IconWrapper = styled.span<{ color?: string }>`
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: ${(props) => props.color};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const Text = styled.p`
  position: relative;
  flex: 1 0 0;
  min-width: 0;
  word-break: break-word;
  color: ${BackgroundColor};
  opacity: 0.88;

  ${() => {
    const token = Typography.body2Normal.bold;
    return css`
      font-family: ${token.fontFamily};
      font-weight: ${token.fontWeight};
      font-size: ${token.fontSize};
      line-height: ${token.lineHeight};
      letter-spacing: ${token.letterSpacing};
    `;
  }}
`;
