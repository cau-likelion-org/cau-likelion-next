import styled, { keyframes } from 'styled-components';

// Figma 로딩 스피너 예시 인스턴스에서 추출한 색상 (프로젝트 색상 토큰에 동일한 값 없음)
const SPINNER_DEFAULT_COLOR = '#DFE0E2';

export interface CircularLoadingProps {
  className?: string;
  size?: number;
  color?: string;
}

const CircularLoading = ({ className, size = 28, color = SPINNER_DEFAULT_COLOR }: CircularLoadingProps) => {
  return (
    <Spinner className={className} $size={size} viewBox="0 0 44 44" role="status" aria-label="로딩 중">
      <Circle $color={color} cx="22" cy="22" r="20" fill="none" strokeWidth="4" />
    </Spinner>
  );
};

export default CircularLoading;

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -124;
  }
`;

const Spinner = styled.svg<{ $size: number }>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  animation: ${rotate} 1.4s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Circle = styled.circle<{ $color: string }>`
  stroke: ${(props) => props.$color};
  stroke-linecap: round;
  animation: ${dash} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35;
  }
`;
