import { InputHTMLAttributes, ReactNode, useId } from 'react';
import styled from 'styled-components';

import { Fill, Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import {
  FieldDescription,
  FieldStatus,
  FieldStatusIcon,
  getFieldBackground,
  getFieldBoxShadow,
} from '@common/fieldStatus/FieldStatus';

interface TrailingButtonConfig {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  status?: FieldStatus;
  heading?: string;
  required?: boolean;
  description?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  trailingButton?: TrailingButtonConfig;
  trailingContent?: ReactNode;
}

const TextField = ({
  className,
  status = 'normal',
  heading,
  required = false,
  description,
  leadingIcon,
  trailingIcon,
  trailingButton,
  trailingContent,
  disabled = false,
  readOnly = false,
  id,
  ...inputProps
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <Root className={className}>
      {heading && (
        <Heading>
          <HeadingLabel htmlFor={inputId}>{heading}</HeadingLabel>
          {required && <Required>*</Required>}
        </Heading>
      )}
      <InputRow>
        <InputWrapper $status={status} $disabled={disabled} $readOnly={readOnly} $attached={!!trailingButton}>
          {leadingIcon && <IconSlot $color={Label.alternative}>{leadingIcon}</IconSlot>}
          <Input
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={status === 'negative'}
            aria-describedby={descriptionId}
            $readOnly={readOnly}
            {...inputProps}
          />
          <FieldStatusIcon status={status} />
          {!trailingButton && status === 'normal' && (trailingContent ?? trailingIcon ?? null)}
        </InputWrapper>
        {trailingButton && (
          <TrailingButton type="button" onClick={trailingButton.onClick} disabled={trailingButton.disabled}>
            {trailingButton.label}
          </TrailingButton>
        )}
      </InputRow>
      {description && (
        <FieldDescription id={descriptionId} $status={status}>
          {description}
        </FieldDescription>
      )}
    </Root>
  );
};

export default TextField;

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

const InputRow = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
`;

const InputWrapper = styled.div<{
  $status: FieldStatus;
  $disabled: boolean;
  $readOnly: boolean;
  $attached: boolean;
}>`
  position: relative;
  display: flex;
  flex: 1 0 0;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 24px;
  padding: 12px;
  border-radius: ${(props) => (props.$attached ? '12px 0 0 12px' : '12px')};
  background-color: ${(props) => getFieldBackground(props.$disabled)};
  box-shadow: ${(props) => getFieldBoxShadow(props.$status, props.$disabled)};

  ${(props) =>
    !props.$readOnly &&
    `
    &:focus-within {
      box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
    }
  `}
`;

const Input = styled.input<{ $readOnly?: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  padding: 0 4px;
  border: none;
  outline: none;
  background: none;
  color: ${Label.normal};
  pointer-events: ${(props) => (props.$readOnly ? 'none' : 'auto')};
  cursor: ${(props) => (props.$readOnly ? 'default' : 'text')};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.assistive};
  }

  &:disabled {
    color: ${Label.disable};
    cursor: not-allowed;
  }

  &:disabled::placeholder {
    color: ${Label.disable};
  }
`;

const IconSlot = styled.span<{ $color: string }>`
  display: flex;
  flex-shrink: 0;
  color: ${(props) => props.$color};
`;

const TrailingButton = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 12px 16px;
  border: none;
  border-radius: 0 12px 12px 0;
  box-shadow:
    inset 0 1px 0 ${Line.normal},
    inset -1px 0 0 ${Line.normal},
    inset 0 -1px 0 ${Line.normal},
    0 1px 2px rgba(0, 0, 0, 0.03);
  background: none;
  color: ${Orange.o500};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    box-shadow:
      inset 0 1px 0 ${Line.subtle},
      inset -1px 0 0 ${Line.subtle},
      inset 0 -1px 0 ${Line.subtle},
      0 1px 2px rgba(0, 0, 0, 0.03);
    background-color: ${Fill.subtle};
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;
