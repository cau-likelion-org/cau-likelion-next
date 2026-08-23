import { useId } from 'react';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { BackgroundColor, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import type { TypographyToken } from '@utils/constant/typography';

type RadioSize = 'small' | 'medium';

export interface RadioProps {
  className?: string;
  size?: RadioSize;
  checked?: boolean;
  bold?: boolean;
  tight?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  ariaLabel?: string;
  name?: string;
  value?: string;
  multiple?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
}

const HALO_INSET = 4;

const sizeConfig: Record<RadioSize, number> = {
  small: 16,
  medium: 20,
};

const typographyBySize: Record<RadioSize, TypographyToken> = {
  small: Typography.label1Normal.regular,
  medium: Typography.body2Normal.regular,
};

const Radio = ({
  className,
  size = 'medium',
  checked = false,
  bold = false,
  tight = false,
  disabled = false,
  label,
  ariaLabel,
  name,
  value,
  multiple = false,
  onChange,
  id,
}: RadioProps) => {
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const box = sizeConfig[size];

  return (
    <Root className={className}>
      <ControlWrapper $tight={tight}>
        <Box
          as="input"
          type={multiple ? 'checkbox' : 'radio'}
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-label={!label ? ariaLabel : undefined}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <Indicator $box={box} $checked={checked} $disabled={disabled} aria-hidden>
          {checked && <Dot $box={box} />}
        </Indicator>
        <Halo />
      </ControlWrapper>
      {label && (
        <LabelText htmlFor={radioId} $size={size} $bold={bold} $disabled={disabled}>
          {label}
        </LabelText>
      )}
    </Root>
  );
};

export default Radio;

const Root = styled.div`
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
`;

const ControlWrapper = styled.div<{ $tight: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px ${(props) => (props.$tight ? 0 : 2)}px;
`;

const Box = styled.input`
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;

const Indicator = styled.span<{ $box: number; $checked: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$box}px;
  height: ${(props) => props.$box}px;
  border-radius: 50%;
  border: 1.5px solid ${(props) => (props.$checked ? Orange.o500 : Line.strong)};
  background-color: ${(props) => (props.$checked ? Orange.o500 : 'transparent')};
  pointer-events: none;

  ${(props) =>
    props.$disabled &&
    css`
      opacity: 0.43;
    `}
`;

const Dot = styled.span<{ $box: number }>`
  width: ${(props) => props.$box * 0.4}px;
  height: ${(props) => props.$box * 0.4}px;
  border-radius: 50%;
  background-color: ${BackgroundColor};
`;

const Halo = styled.span`
  position: absolute;
  inset: -${HALO_INSET}px;
  border-radius: 50%;
  background-color: ${Label.normal};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;

  ${Box}:not(:disabled):hover ~ & {
    opacity: 0.08;
  }

  ${Box}:not(:disabled):active ~ & {
    opacity: 0.16;
  }

  ${Box}:not(:disabled):focus-visible ~ & {
    opacity: 0.16;
  }
`;

const LabelText = styled.label<{ $size: RadioSize; $bold: boolean; $disabled: boolean }>`
  padding: 1px 0;
  color: ${(props) => (props.$disabled ? Label.disable : Label.normal)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  ${(props) => typographyCss(typographyBySize[props.$size])}
  font-weight: ${(props) => (props.$bold ? 600 : 400)};
`;
