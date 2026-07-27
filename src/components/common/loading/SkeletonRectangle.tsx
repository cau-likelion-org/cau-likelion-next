import styled from 'styled-components';

import { Fill } from '@utils/constant/color';

import { skeletonPulse } from './skeletonPulse';

export interface SkeletonRectangleProps {
  className?: string;
  width?: number;
  height?: number;
  color?: 'normal' | 'white';
}

const SkeletonRectangle = ({ className, width = 64, height = 64, color = 'normal' }: SkeletonRectangleProps) => {
  return <Box className={className} width={width} height={height} color={color} role="status" aria-label="로딩 중" />;
};

export default SkeletonRectangle;

const Box = styled.span<{ width: number; height: number; color: SkeletonRectangleProps['color'] }>`
  display: inline-block;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 3px;
  background-color: ${(props) => (props.color === 'white' ? Fill.white : Fill.subtle)};
  animation: ${skeletonPulse} 1.5s ease-in-out infinite;
`;
