import styled from 'styled-components';

import { IcCircleCheck, IcCircleExclamation } from '@assets/svg';
import { Fill, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// TextField, Textarea, Select, DateTimeInput이 같은 상태 표시(테두리, 아이콘, 하단 문구)를 공유한다
export type FieldStatus = 'normal' | 'positive' | 'negative';

export const getFieldBackground = (disabled: boolean) => (disabled ? Fill.subtle : 'rgba(255, 255, 255, 0.08)');

export const getFieldBoxShadow = (status: FieldStatus, disabled: boolean) => {
  if (disabled) return `inset 0 0 0 1px ${Line.subtle}, 0 1px 2px rgba(0, 0, 0, 0.03)`;
  if (status === 'negative') return 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)';
  return `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`;
};

export const FieldStatusIcon = ({ className, status }: { className?: string; status: FieldStatus }) => {
  if (status === 'normal') return null;

  return (
    <IconSlot className={className} $color={status === 'negative' ? State.error : State.info}>
      {status === 'negative' ? (
        <IcCircleExclamation width={22} height={22} />
      ) : (
        <IcCircleCheck width={22} height={22} />
      )}
    </IconSlot>
  );
};

export const FieldDescription = styled.p<{ $status: FieldStatus }>`
  margin: 0;
  width: 100%;
  color: ${(props) => (props.$status === 'negative' ? State.error : Label.alternative)};
  ${typographyCss(Typography.caption1.regular)}
`;

const IconSlot = styled.span<{ $color: string }>`
  display: flex;
  flex-shrink: 0;
  color: ${(props) => props.$color};
`;
