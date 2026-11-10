import styled from 'styled-components';

import { Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface StatCountItem {
  label: string;
  count: number;
  tone?: 'normal' | 'strong' | 'accent';
}

export interface StatCountsProps {
  className?: string;
  items: StatCountItem[];
}

const toneColor = { normal: Label.alternative, strong: Label.normal, accent: Orange.o500 };

const StatCounts = ({ className, items }: StatCountsProps) => (
  <Root className={className}>
    {items.map(({ label, count, tone = 'normal' }) => (
      <Item key={label} $color={toneColor[tone]}>
        <span>{label}</span>
        <span>{count}명</span>
      </Item>
    ))}
  </Root>
);

export default StatCounts;

const Root = styled.div`
  display: flex;
  ${typographyCss(Typography.body2Normal.medium)}
`;

const Item = styled.span<{ $color: string }>`
  display: flex;
  gap: 4px;
  padding: 0 4px;
  color: ${(props) => props.$color};
  opacity: 0.74;
`;
