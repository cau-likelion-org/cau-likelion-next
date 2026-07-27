import styled from 'styled-components';

import { SkeletonFill } from '@utils/constant/color';

import { skeletonPulse } from './skeletonPulse';

export interface SkeletonCircleProps {
  className?: string;
  size?: number;
  color?: 'normal' | 'white';
}

const SkeletonCircle = ({ className, size = 64, color = 'normal' }: SkeletonCircleProps) => {
  return <Circle className={className} size={size} color={color} role="status" aria-label="로딩 중" />;
};

export default SkeletonCircle;

const Circle = styled.span<{ size: number; color: SkeletonCircleProps['color'] }>`
  display: inline-block;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: ${(props) => (props.color === 'white' ? SkeletonFill.white : SkeletonFill.alternative)};
  animation: ${skeletonPulse} 1.5s ease-in-out infinite;
`;
