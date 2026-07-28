import { ReactNode, TextareaHTMLAttributes, useId } from 'react';
import styled from 'styled-components';

import IcCircleCheck from '@assets/svg/ic-circle-check.svg';
import IcCircleExclamation from '@assets/svg/ic-circle-exclamation.svg';
import { Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type TextareaStatus = 'normal' | 'positive' | 'negative';
type TextareaResize = 'normal' | 'limit' | 'fixed';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string;
  status?: TextareaStatus;
  resize?: TextareaResize;
  maxHeight?: number;
  heading?: string;
  required?: boolean;
  description?: string;
  bottomLeadingContent?: ReactNode;
  bottomTrailingContent?: ReactNode;
}

const getBoxShadow = (status: TextareaStatus, disabled: boolean) => {
  if (disabled) return `inset 0 0 0 1px ${Line.alternative}, 0 1px 2px rgba(0, 0, 0, 0.03)`;
  if (status === 'negative') return 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)';
  return `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`;
};

const getResizeCss = (resize: TextareaResize) => {
  if (resize === 'fixed') return 'none';
  return 'vertical';
};

const Textarea = ({
  className,
  status = 'normal',
  resize = 'normal',
  maxHeight,
  heading,
  required = false,
  description,
  bottomLeadingContent,
  bottomTrailingContent,
  disabled = false,
  id,
  ...textareaProps
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

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
          <HeadingLabel htmlFor={textareaId}>{heading}</HeadingLabel>
          {required && <Required>*</Required>}
        </Heading>
      )}
      <InputWrapper $status={status} $disabled={disabled}>
        <StyledTextarea
          id={textareaId}
          disabled={disabled}
          $resize={resize}
          style={maxHeight ? { maxHeight } : undefined}
          {...textareaProps}
        />
        {statusIcon}
        {(bottomLeadingContent || bottomTrailingContent) && (
          <Bottom>
            {bottomLeadingContent && <BottomSlot>{bottomLeadingContent}</BottomSlot>}
            {bottomTrailingContent && <BottomSlot $trailing>{bottomTrailingContent}</BottomSlot>}
          </Bottom>
        )}
      </InputWrapper>
      {description && <Description $status={status}>{description}</Description>}
    </Root>
  );
};

export default Textarea;

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

const InputWrapper = styled.div<{ $status: TextareaStatus; $disabled: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: ${(props) => (props.$disabled ? '#F4F4F5' : 'rgba(255, 255, 255, 0.08)')};
  box-shadow: ${(props) => getBoxShadow(props.$status, props.$disabled)};

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const StyledTextarea = styled.textarea<{ $resize: TextareaResize }>`
  width: 100%;
  min-height: 78px;
  padding: 0 4px;
  border: none;
  outline: none;
  background: none;
  resize: ${(props) => getResizeCss(props.$resize)};
  color: ${Label.normal};
  ${typographyCss(Typography.body1Reading.regular)}

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
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-shrink: 0;
  color: ${(props) => props.$color};
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  width: 100%;
`;

const BottomSlot = styled.div<{ $trailing?: boolean }>`
  display: flex;
  align-items: center;
  flex: ${(props) => (props.$trailing ? '0 0 auto' : '1 1 auto')};
  min-width: 0;
`;

const Description = styled.p<{ $status: TextareaStatus }>`
  margin: 0;
  width: 100%;
  color: ${(props) => (props.$status === 'negative' ? State.error : Label.alternative)};
  ${typographyCss(Typography.caption1.regular)}
`;
