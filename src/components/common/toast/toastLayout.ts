import styled from 'styled-components';

export const WIDE_TOAST_WIDTH = 500;

export const NarrowBreak = styled.br`
  @media (min-width: ${WIDE_TOAST_WIDTH + 40}px) {
    display: none;
  }
`;

// 토스트를 헤더 아래 화면 가운데에 띄우는 고정 위치 (모달보다 위)
export const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
