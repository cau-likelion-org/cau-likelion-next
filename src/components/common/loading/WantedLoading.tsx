import styled, { keyframes } from 'styled-components';

import { AccentBackground, System } from '@utils/constant/color';

export interface WantedLoadingProps {
  className?: string;
  size?: number;
}

const WantedLoading = ({ className, size = 32 }: WantedLoadingProps) => {
  return <Blob className={className} size={size} role="status" aria-label="로딩 중" />;
};

export default WantedLoading;

const morph = keyframes`
  0%, 100% {
    border-radius: 50%;
    background-color: ${System.blue};
    transform: scale(1);
  }
  25% {
    border-radius: 30%;
    background-color: ${AccentBackground.pink};
    transform: scale(0.85);
  }
  50% {
    border-radius: 50%;
    background-color: ${AccentBackground.redOrange};
    transform: scale(1);
  }
  75% {
    border-radius: 30%;
    background-color: ${AccentBackground.violet};
    transform: scale(0.85);
  }
`;

const Blob = styled.span<{ size: number }>`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: ${morph} 2s ease-in-out infinite;
`;
