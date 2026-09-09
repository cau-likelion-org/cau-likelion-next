import styled from 'styled-components';

import { Label } from '@utils/constant/color';

export interface PaginationDotsProps {
  className?: string;
  total: number;
  current: number;
  size?: 'small' | 'medium';
  variant?: 'normal' | 'white';
}

const SIZE_STYLE = {
  small: { normal: 6, small: 4, xs: 2, gap: 6 },
  medium: { normal: 10, small: 8, xs: 6, gap: 10 },
} as const;

type DotSize = 'normal' | 'small' | 'xs';

const WINDOW = 5;

const getDotLayout = (total: number, current: number): { size: DotSize; active: boolean }[] => {
  if (total <= 0) return [];

  if (total <= WINDOW) {
    return Array.from({ length: total }, (_, index) => ({ size: 'normal', active: index === current }));
  }

  const half = Math.floor(WINDOW / 2);
  const start = Math.min(Math.max(current - half, 0), total - WINDOW);
  const end = start + WINDOW - 1;

  const dots: { size: DotSize; active: boolean }[] = [];
  if (start > 1) dots.push({ size: 'xs', active: false });
  if (start > 0) dots.push({ size: 'small', active: false });
  for (let index = start; index <= end; index += 1) {
    dots.push({ size: 'normal', active: index === current });
  }
  if (end < total - 1) dots.push({ size: 'small', active: false });
  if (end < total - 2) dots.push({ size: 'xs', active: false });

  return dots;
};

const PaginationDots = ({ className, total, current, size = 'medium', variant = 'normal' }: PaginationDotsProps) => {
  const style = SIZE_STYLE[size];
  const dots = getDotLayout(total, current);

  return (
    <List className={className} gap={style.gap} role="tablist" aria-label="페이지네이션">
      {dots.map((dot, index) => (
        <Dot key={index} diameter={style[dot.size]} active={dot.active} variant={variant} />
      ))}
    </List>
  );
};

export default PaginationDots;

const List = styled.div<{ gap: number }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.gap}px;
`;

const Dot = styled.span<{ diameter: number; active: boolean; variant: PaginationDotsProps['variant'] }>`
  display: inline-block;
  flex-shrink: 0;
  width: ${(props) => props.diameter}px;
  height: ${(props) => props.diameter}px;
  border-radius: 50%;
  background-color: ${(props) => (props.variant === 'white' ? '#FFFFFF' : Label.normal)};
  opacity: ${(props) => (props.active ? 1 : props.variant === 'white' ? 0.52 : 0.16)};
`;
