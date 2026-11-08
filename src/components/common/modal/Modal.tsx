import { ReactNode, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import ScrollArea from '@common/scrollArea/ScrollArea';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundWhite, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// Figma 모달 규격 두 가지
// - small: 여백 20, 제목 Headline 1, 모서리 12 (Figma Alert/Resource/Dialog 기본)
// - medium: 여백 28, 제목 Heading 2, 모서리 16
export type ModalSize = 'small' | 'medium';

const SIZE_STYLE = {
  small: { padding: 20, radius: 12, title: Typography.headline1.bold, actionsPadding: '0 20px 12px' },
  medium: { padding: 28, radius: 16, title: Typography.heading2.bold, actionsPadding: '0 28px 20px' },
} as const;

export interface ModalProps {
  className?: string;
  size?: ModalSize;
  ariaLabel: string;
  // 배경 클릭·Esc로 닫을 때 호출한다
  onClose: () => void;
  children: ReactNode;
}

const subscribeNothing = () => () => {};

// 배경·포커스 가두기·스크롤 막기·Esc 닫기를 맡는 모달 틀. 안쪽은 ModalInformation·ModalActions로 채운다
const Modal = (props: ModalProps) => {
  // 서버 렌더링 중에는 document가 없어 body에 그릴 수 없으므로, 브라우저에서만 그린다
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );

  // 표·스크롤 영역 안에서 열어도 화면 기준으로 뜨도록 body에 그린다
  return isClient ? createPortal(<ModalContent {...props} />, document.body) : null;
};

const ModalContent = ({ className, size = 'small', ariaLabel, onClose, children }: ModalProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  useFocusTrap(boxRef, onClose);

  return (
    <ModalOverlay role="dialog" aria-modal="true" aria-label={ariaLabel} onDimmerClick={onClose}>
      <Box ref={boxRef} className={className} tabIndex={-1} $size={size}>
        {children}
      </Box>
    </ModalOverlay>
  );
};

export default Modal;

export interface ModalInformationProps {
  className?: string;
  align?: 'left' | 'center';
  children: ReactNode;
}

export const ModalInformation = ({ className, align = 'left', children }: ModalInformationProps) => (
  <ScrollArea>
    <Information className={className} $align={align}>
      {children}
    </Information>
  </ScrollArea>
);

export const ModalTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
`;

export const ModalDescription = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.regular)}
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;

const Information = styled.div<{ $align: 'left' | 'center' }>`
  display: flex;
  flex-direction: column;
  word-break: break-word;

  ${(props) =>
    props.$align === 'center' &&
    css`
      align-items: center;
      text-align: center;
      word-break: keep-all;
    `}
`;

const Box = styled.div<{ $size: ModalSize }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  border-radius: ${(props) => SIZE_STYLE[props.$size].radius}px;
  overflow: hidden;
  outline: none;
  background-color: ${BackgroundWhite.primary};

  ${Information} {
    padding: ${(props) => SIZE_STYLE[props.$size].padding}px;
  }

  ${ModalTitle} {
    ${(props) => typographyCss(SIZE_STYLE[props.$size].title)}
  }

  ${ModalActions} {
    padding: ${(props) => SIZE_STYLE[props.$size].actionsPadding};
  }
`;
