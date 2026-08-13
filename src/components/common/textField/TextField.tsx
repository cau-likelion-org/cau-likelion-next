import { InputHTMLAttributes, ReactNode, useId } from 'react';
import styled from 'styled-components';

import { IcCircleCheck, IcCircleExclamation } from '@assets/svg';
import { Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type TextFieldStatus = 'normal' | 'positive' | 'negative';

interface TrailingButtonConfig {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  status?: TextFieldStatus;
  heading?: string;
  required?: boolean;
  description?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  trailingButton?: TrailingButtonConfig;
  trailingContent?: ReactNode;
}

const getBoxShadow = (status: TextFieldStatus, disabled: boolean) => {
  if (disabled) return `inset 0 0 0 1px ${Line.alternative}, 0 1px 2px rgba(0, 0, 0, 0.03)`;
  if (status === 'negative') return 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)';
  return `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`;
};

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

  const trailing = (
    <>
      {statusIcon}
      {trailingButton ? (
        <TrailingButton type="button" onClick={trailingButton.onClick} disabled={trailingButton.disabled}>
          {trailingButton.label}
        </TrailingButton>
      ) : (
        !statusIcon && (trailingContent ?? trailingIcon ?? null)
      )}
    </>
  );

  return (
    <Root className={className}>
      {heading && (
        <Heading>
          <HeadingLabel htmlFor={inputId}>{heading}</HeadingLabel>
          {required && <Required>*</Required>}
        </Heading>
      )}
      <InputWrapper $status={status} $disabled={disabled} $readOnly={readOnly}>
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
        {trailing}
      </InputWrapper>
      {description && (
        <Description id={descriptionId} $status={status}>
          {description}
        </Description>
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

const InputWrapper = styled.div<{ $status: TextFieldStatus; $disabled: boolean; $readOnly: boolean }>`
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

const Description = styled.p<{ $status: TextFieldStatus }>`
  margin: 0;
  width: 100%;
  color: ${(props) => (props.$status === 'negative' ? State.error : Label.alternative)};
  ${typographyCss(Typography.caption1.regular)}
`;

const TrailingButton = styled.button`
  flex-shrink: 0;
  padding: 12px 16px;
  border: none;
  border-radius: 12px;
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px rgba(0, 0, 0, 0.03);
  background: none;
  color: ${Orange.o500};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;
