import { InputHTMLAttributes, useId } from 'react';
import styled from 'styled-components';

import { IcCalendar, IcClock } from '@assets/svg';
import { Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import {
  FieldDescription,
  FieldStatus,
  FieldStatusIcon,
  getFieldBackground,
  getFieldBoxShadow,
} from '@common/fieldStatus/FieldStatus';

type DateTimeInputType = 'date' | 'time';

export interface DateTimeInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange' | 'placeholder'
> {
  type?: DateTimeInputType;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  status?: FieldStatus;
  description?: string;
  highlight?: boolean;
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
  highlight = false,
  readOnly = false,
  disabled = false,
  ...inputProps
}: DateTimeInputProps) => {
  const Icon = type === 'date' ? IcCalendar : IcClock;
  const descriptionId = useId();

  return (
    <Root className={className}>
      <Box $status={status} $inactive={readOnly || disabled}>
        <Icon width={22} height={22} />
        <Text $filled={!!value} $disabled={disabled} $highlight={highlight}>
          {value ? formatValue(type, value) : placeholder}
        </Text>
        <FieldStatusIcon status={status} />
        {!readOnly && (
          <HiddenInput
            {...inputProps}
            type={type}
            value={value}
            disabled={disabled}
            aria-invalid={status === 'negative'}
            aria-describedby={description ? descriptionId : undefined}
            onChange={(event) => onChange?.(event.target.value)}
            onClick={(event) => event.currentTarget.showPicker?.()}
          />
        )}
      </Box>
      {description && (
        <FieldDescription id={descriptionId} $status={status}>
          {description}
        </FieldDescription>
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

// 읽기 전용과 비활성은 같은 비활성 배경·테두리로 보여준다
const Box = styled.div<{ $status: FieldStatus; $inactive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${(props) => getFieldBackground(props.$inactive)};
  box-shadow: ${(props) => getFieldBoxShadow(props.$status, props.$inactive)};

  & > svg {
    flex-shrink: 0;
  }

  ${(props) =>
    !props.$inactive &&
    `
    &:focus-within {
      box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
    }
  `}
`;

const getTextColor = ({
  $disabled,
  $filled,
  $highlight,
}: {
  $disabled: boolean;
  $filled: boolean;
  $highlight: boolean;
}) => {
  if ($disabled) return Label.disable;
  if (!$filled) return Label.assistive;
  return $highlight ? Orange.o500 : Label.normal;
};

const Text = styled.span<{ $filled: boolean; $disabled: boolean; $highlight: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${getTextColor};
  text-decoration: ${(props) => (props.$highlight && props.$filled ? 'underline' : 'none')};
  ${typographyCss(Typography.body1Normal.regular)}
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
