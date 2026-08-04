import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FunctionComponent, SVGProps } from 'react';
import { IcCircleCheck, IcCircleExclamation, IcTriangleExclamation } from '@assets/svg';
import { BackgroundColor, Black, FeedbackStatus, System } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type ToastVariant = 'normal' | 'positive' | 'cautionary' | 'negative';

export interface ToastProps {
  className?: string;
  variant?: ToastVariant;
  text: React.ReactNode;
  icon?: React.ReactNode;
  show: boolean;
  width?: number;
  delay?: number;
  duration?: number;
  onHidden?: () => void;
}

const TRANSITION_MS = 300;

const statusIcon: Record<
  'positive' | 'cautionary' | 'negative',
  { Icon: FunctionComponent<SVGProps<SVGSVGElement>>; color: string }
> = {
  positive: { Icon: IcCircleCheck, color: FeedbackStatus.positive },
  cautionary: { Icon: IcTriangleExclamation, color: FeedbackStatus.cautionary },
  negative: { Icon: IcCircleExclamation, color: FeedbackStatus.negative },
};

const Toast = ({
  className,
  variant = 'normal',
  text,
  icon,
  show,
  width = 335,
  delay = 300,
  duration = 1000,
  onHidden,
}: ToastProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timersRef = useRef<{
    show?: ReturnType<typeof setTimeout>;
    hide?: ReturnType<typeof setTimeout>;
    unmount?: ReturnType<typeof setTimeout>;
    frame?: ReturnType<typeof requestAnimationFrame>;
  }>({});
  const onHiddenRef = useRef(onHidden);
  useEffect(() => {
    onHiddenRef.current = onHidden;
  }, [onHidden]);

  useEffect(() => {
    const clearAll = () => {
      clearTimeout(timersRef.current.show);
      clearTimeout(timersRef.current.hide);
      clearTimeout(timersRef.current.unmount);
      if (timersRef.current.frame !== undefined) cancelAnimationFrame(timersRef.current.frame);
    };
    clearAll();

    if (!show) {
      timersRef.current.hide = setTimeout(() => setIsVisible(false), 0);
      timersRef.current.unmount = setTimeout(() => setIsMounted(false), TRANSITION_MS);
      return clearAll;
    }

    timersRef.current.show = setTimeout(() => {
      setIsMounted(true);
      timersRef.current.frame = requestAnimationFrame(() => setIsVisible(true));
      timersRef.current.hide = setTimeout(() => {
        setIsVisible(false);
        timersRef.current.unmount = setTimeout(() => {
          setIsMounted(false);
          onHiddenRef.current?.();
        }, TRANSITION_MS);
      }, duration);
    }, delay);

    return clearAll;
  }, [show, text, delay, duration]);

  if (!isMounted) return null;

  const status = variant === 'normal' ? null : statusIcon[variant];

  return (
    <Container className={className} $visible={isVisible} $width={width}>
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

const Container = styled.div<{ $visible: boolean; $width: number }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: ${(props) => props.$width}px;
  padding: 11px 16px;
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: translateY(${(props) => (props.$visible ? '0' : '-8px')});
  transition:
    opacity ${TRANSITION_MS}ms ease,
    transform ${TRANSITION_MS}ms ease;

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
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  word-break: break-word;
  color: ${BackgroundColor};
  opacity: 0.88;

  ${typographyCss(Typography.body2Normal.bold)}
`;
