import styled from 'styled-components';

import { Fill } from '@utils/constant/color';

export interface CircularLoadingProps {
  className?: string;
  size?: number;
  color?: string;
}

const CircularLoading = ({ className, size = 28, color = Fill.solid }: CircularLoadingProps) => {
  return <Spinner className={className} $size={size} $color={color} role="status" aria-label="로딩 중" />;
};

export default CircularLoading;

const Spinner = styled.span<{ $size: number; $color: string }>`
  display: inline-block;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, ${(props) => props.$color});
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - ${(props) => props.$size * 0.11}px),
    #000 calc(100% - ${(props) => props.$size * 0.11}px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - ${(props) => props.$size * 0.11}px),
    #000 calc(100% - ${(props) => props.$size * 0.11}px)
  );
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
