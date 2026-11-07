import { ReactNode, TextareaHTMLAttributes, useId } from 'react';
import styled from 'styled-components';

import { Label, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import {
  FieldDescription,
  FieldStatus,
  FieldStatusIcon,
  getFieldBackground,
  getFieldBoxShadow,
} from '@common/fieldStatus/FieldStatus';

type TextareaResize = 'normal' | 'limit' | 'fixed';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string;
  status?: FieldStatus;
  resize?: TextareaResize;
  maxHeight?: number;
  heading?: string;
  required?: boolean;
  description?: string;
  bottomLeadingContent?: ReactNode;
  bottomTrailingContent?: ReactNode;
}

const getResizeCss = (resize: TextareaResize) => {
  if (resize === 'fixed') return 'none';
  return 'vertical';
};

const Textarea = ({
  className,
  status = 'normal',
  resize = 'fixed',
  maxHeight,
  heading,
  required = false,
  description,
  bottomLeadingContent,
  bottomTrailingContent,
  disabled = false,
  readOnly = false,
  id,
  rows = 1,
  ...textareaProps
}: TextareaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = description ? `${textareaId}-description` : undefined;
  const hasStatusIcon = status !== 'normal';

  return (
    <Root className={className}>
      {heading && (
        <Heading>
          <HeadingLabel htmlFor={textareaId}>{heading}</HeadingLabel>
          {required && <Required>*</Required>}
        </Heading>
      )}
      <InputWrapper $status={status} $disabled={disabled} $readOnly={readOnly}>
        <StyledTextarea
          id={textareaId}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          $resize={resize}
          $hasStatusIcon={hasStatusIcon}
          $readOnly={readOnly}
          style={maxHeight ? { maxHeight } : undefined}
          aria-invalid={status === 'negative'}
          aria-describedby={descriptionId}
          {...textareaProps}
        />
        <StatusIcon status={status} />
        {(bottomLeadingContent || bottomTrailingContent) && (
          <Bottom>
            {bottomLeadingContent && <BottomSlot>{bottomLeadingContent}</BottomSlot>}
            {bottomTrailingContent && <BottomSlot $trailing>{bottomTrailingContent}</BottomSlot>}
          </Bottom>
        )}
      </InputWrapper>
      {description && (
        <FieldDescription id={descriptionId} $status={status}>
          {description}
        </FieldDescription>
      )}
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

const InputWrapper = styled.div<{ $status: FieldStatus; $disabled: boolean; $readOnly: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
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

const StyledTextarea = styled.textarea<{ $resize: TextareaResize; $hasStatusIcon: boolean; $readOnly: boolean }>`
  width: 100%;
  min-height: 26px;
  padding: ${(props) => (props.$hasStatusIcon ? '0 36px 0 4px' : '0 4px')};
  border: none;
  outline: none;
  background: none;
  resize: ${(props) => getResizeCss(props.$resize)};
  color: ${Label.normal};
  cursor: ${(props) => (props.$readOnly ? 'default' : 'text')};
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

const StatusIcon = styled(FieldStatusIcon)`
  position: absolute;
  top: 12px;
  right: 12px;
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
