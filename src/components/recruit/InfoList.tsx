import { ReactNode } from 'react';
import styled from 'styled-components';

import { Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface InfoListRow {
  label: string;
  value: ReactNode;
}

export interface InfoListProps {
  className?: string;
  rows: InfoListRow[];
  labelWidth?: number;
}

const InfoList = ({ className, rows, labelWidth = 72 }: InfoListProps) => (
  <Box className={className}>
    {rows.map(({ label, value }) => (
      <Row key={label}>
        <Term $width={labelWidth}>{label}</Term>
        <Description>{value}</Description>
      </Row>
    ))}
  </Box>
);

export default InfoList;

const Box = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 16px 18px;
  border-radius: 8px;
  background-color: ${Fill.subtle};
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const Term = styled.dt<{ $width: number }>`
  flex-shrink: 0;
  width: ${(props) => props.$width}px;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const Description = styled.dd`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.medium)}
`;
