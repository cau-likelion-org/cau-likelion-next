import { InputHTMLAttributes, useId } from 'react';
import styled, { css } from 'styled-components';

import { IcCalendar, IcCircleExclamation, IcClock } from '@assets/svg';
import { Fill, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type DateTimeInputType = 'date' | 'time';

export interface DateTimeInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'placeholder'
> {
  type?: DateTimeInputType;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  status?: 'normal' | 'negative';
  description?: string;
}

const DEFAULT_PLACEHOLDER: Record<DateTimeInputType, string> = {
  date: '캘린더 선택',
  time: '시간 선택',
};

const formatValue = (type: DateTimeInputType, value: string) =>
  type === 'date' ? value.slice(0, 10).replace(/-/g, '/') : value;

const DateTimeInput = ({
  className,
  type = 'date',
  value,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER[type],
  status = 'normal',
  description,
  readOnly = false,
  ...inputProps
}: DateTimeInputProps) => {
  const Icon = type === 'date' ? IcCalendar : IcClock;
  const descriptionId = useId();

  return (
    <Root className={className}>
      <Box $status={status} $readOnly={readOnly}>
        <Icon width={22} height={22} />
        <Text $filled={!!value}>{value ? formatValue(type, value) : placeholder}</Text>
        {status === 'negative' && (
          <ErrorIcon>
            <IcCircleExclamation width={22} height={22} />
          </ErrorIcon>
        )}
        {!readOnly && (
          <HiddenInput
            type={type}
            value={value}
            aria-invalid={status === 'negative'}
            aria-describedby={description ? descriptionId : undefined}
            onChange={(event) => onChange?.(event.target.value)}
            onClick={(event) => event.currentTarget.showPicker?.()}
            {...inputProps}
          />
        )}
      </Box>
      {description && (
        <Description id={descriptionId} $status={status}>
          {description}
        </Description>
      )}
    </Root>
  );
};

export default DateTimeInput;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;

const Box = styled.div<{ $status: 'normal' | 'negative'; $readOnly: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 12px;

  & > svg {
    flex-shrink: 0;
  }

  ${(props) =>
    props.$readOnly
      ? css`
          background-color: ${Fill.subtle};
          box-shadow:
            inset 0 0 0 1px ${Line.subtle},
            0 1px 2px 0 rgba(0, 0, 0, 0.03);
        `
      : css`
          background-color: rgba(255, 255, 255, 0.08);
          box-shadow: ${
            props.$status === 'negative'
              ? 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)'
              : `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`
          };

          &:focus-within {
            box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
          }
        `}
`;

const Text = styled.span<{ $filled: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$filled ? Label.normal : Label.assistive)};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const ErrorIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${State.error};
`;

const Description = styled.p<{ $status: 'normal' | 'negative' }>`
  margin: 0;
  width: 100%;
  color: ${(props) => (props.$status === 'negative' ? State.error : Label.alternative)};
  ${typographyCss(Typography.caption1.regular)}
`;

const HiddenInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;
