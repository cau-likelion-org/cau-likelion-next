import styled from 'styled-components';

import { Fill } from '@utils/constant/color';

import { skeletonPulse } from './skeletonPulse';

export interface SkeletonTextProps {
  className?: string;
  align?: 'leading' | 'center' | 'trailing';
  color?: 'normal' | 'white';
  length?: '100%' | '75%' | '50%' | '25%';
}

const SkeletonText = ({ className, align = 'leading', color = 'normal', length = '100%' }: SkeletonTextProps) => {
  return (
    <Wrapper className={className} $align={align} role="status" aria-label="로딩 중">
      <Bar $color={color} $length={length} />
    </Wrapper>
  );
};

export default SkeletonText;

const ALIGN_TO_JUSTIFY_CONTENT = {
  leading: 'flex-start',
  center: 'center',
  trailing: 'flex-end',
} as const;

const Wrapper = styled.span<{ $align: SkeletonTextProps['align'] }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => ALIGN_TO_JUSTIFY_CONTENT[props.$align ?? 'leading']};
  width: 100%;
  height: 22px;
  padding: 2px 0;
`;

const Bar = styled.span<{ $color: SkeletonTextProps['color']; $length: SkeletonTextProps['length'] }>`
  display: inline-block;
  width: ${(props) => props.$length};
  height: 100%;
  border-radius: 3px;
  background-color: ${(props) => (props.$color === 'white' ? Fill.white : Fill.normal)};
  animation: ${skeletonPulse} 1.5s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
