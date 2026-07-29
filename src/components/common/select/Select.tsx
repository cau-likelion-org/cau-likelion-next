import { ReactNode, useId } from 'react';
import styled from 'styled-components';

import IcChevronDown from '@assets/svg/ic-chevron-down.svg';
import IcCircleCheck from '@assets/svg/ic-circle-check.svg';
import IcCircleExclamation from '@assets/svg/ic-circle-exclamation.svg';
import { Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import Chip from '../chip/Chip';

type SelectStatus = 'normal' | 'positive' | 'negative';

export interface SelectChipItem {
  label: string;
  onRemove?: () => void;
}

export interface SelectProps {
  className?: string;
  status?: SelectStatus;
  placeholder?: string;
  value?: string;
  chips?: SelectChipItem[];
  leadingIcon?: ReactNode;
  heading?: string;
  required?: boolean;
  description?: string;
  disabled?: boolean;
  onClick?: () => void;
  'aria-expanded'?: boolean;
  'aria-label'?: string;
}

const getBoxShadow = (status: SelectStatus, disabled: boolean) => {
  if (disabled) return `inset 0 0 0 1px ${Line.alternative}, 0 1px 2px rgba(0, 0, 0, 0.03)`;
  if (status === 'negative') return 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)';
  return `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`;
};

const Select = ({
  className,
  status = 'normal',
  placeholder,
  value,
  chips,
  leadingIcon,
  heading,
  required = false,
  description,
  disabled = false,
  onClick,
  id,
  ...rest
}: SelectProps & { id?: string }) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = description ? `${selectId}-description` : undefined;

  const statusIcon =
    status === 'negative' ? (
      <IconSlot $color={State.error}>
        <IcCircleExclamation width={22} height={22} />
      </IconSlot>
    ) : status === 'positive' ? (
      <IconSlot $color={State.info}>
        <IcCircleCheck width={22} height={22} />
      </IconSlot>
    ) : null;

  return (
    <Root className={className}>
      {heading && (
        <Heading>
          <HeadingLabel htmlFor={selectId}>{heading}</HeadingLabel>
          {required && <Required>*</Required>}
        </Heading>
      )}
      <Trigger
        id={selectId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onClick}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick?.();
          }
        }}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-describedby={descriptionId}
        $status={status}
        $disabled={disabled}
        {...rest}
      >
        {leadingIcon && <IconSlot $color={Label.alternative}>{leadingIcon}</IconSlot>}
        {chips && chips.length > 0 ? (
          <ChipRow onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
            {chips.map((chip, index) => (
              <Chip
                key={`${chip.label}-${index}`}
                size="xsmall"
                trailingIcon={chip.onRemove && <RemoveIcon>×</RemoveIcon>}
                onClick={chip.onRemove}
              >
                {chip.label}
              </Chip>
            ))}
          </ChipRow>
        ) : (
          <Text $placeholder={!value}>{value || placeholder}</Text>
        )}
        {statusIcon}
        <IconSlot $color={Label.normal}>
          <IcChevronDown width={16} height={16} />
        </IconSlot>
      </Trigger>
      {description && (
        <Description id={descriptionId} $status={status}>
          {description}
        </Description>
      )}
    </Root>
  );
};

export default Select;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
`;

const HeadingLabel = styled.label`
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const Required = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.label1Normal.medium)}
`;

const Trigger = styled.div<{ $status: SelectStatus; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${(props) => (props.$disabled ? '#F4F4F5' : 'rgba(255, 255, 255, 0.08)')};
  box-shadow: ${(props) => getBoxShadow(props.$status, props.$disabled)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  text-align: left;

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const Text = styled.span<{ $placeholder: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.normal)};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const ChipRow = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  gap: 4px;
  overflow: hidden;
  mask-image: linear-gradient(to right, black calc(100% - 24px), transparent 100%);
`;

const RemoveIcon = styled.span`
  font-size: 12px;
  line-height: 1;
`;

const IconSlot = styled.span<{ $color: string }>`
  display: flex;
  flex-shrink: 0;
  color: ${(props) => props.$color};
`;

const Description = styled.p<{ $status: SelectStatus }>`
  margin: 0;
  width: 100%;
  color: ${(props) => (props.$status === 'negative' ? State.error : Label.alternative)};
  ${typographyCss(Typography.caption1.regular)}
`;
