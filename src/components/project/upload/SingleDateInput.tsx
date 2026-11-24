import { useRef } from 'react';
import styled from 'styled-components';

import { IcCalendar, IcCircleExclamation } from '@assets/svg';
import { Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const SingleDateInput = ({
  placeholder,
  ariaLabel,
  value,
  min,
  onChange,
  invalid = false,
}: {
  placeholder: string;
  ariaLabel: string;
  value: string;
  min?: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <DateInputWrapper $invalid={invalid} onClick={() => inputRef.current?.showPicker?.()}>
      <IcCalendar width={22} height={22} />
      <DateValue $placeholder={!value}>{value || placeholder}</DateValue>
      {invalid && (
        <IconSlot>
          <IcCircleExclamation width={22} height={22} />
        </IconSlot>
      )}
      <HiddenDateInput
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        aria-invalid={invalid}
      />
    </DateInputWrapper>
  );
};

export default SingleDateInput;

const DateInputWrapper = styled.div<{ $invalid: boolean }>`
  position: relative;
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  color: ${Label.normal};
  box-shadow: ${(props) =>
    props.$invalid
      ? 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)'
      : `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`};
  cursor: pointer;

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const IconSlot = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${State.error};
`;

const DateValue = styled.span<{ $placeholder: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  ${typographyCss(Typography.body1Normal.regular)}
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.normal)};
`;

const HiddenDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  opacity: 0;
  cursor: pointer;
`;
