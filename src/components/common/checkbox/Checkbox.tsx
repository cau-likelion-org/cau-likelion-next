import { ReactNode, useEffect, useId, useRef } from 'react';
import styled, { css } from 'styled-components';

import IcCheck from '@assets/svg/ic-check.svg';
import IcLineHorizontal from '@assets/svg/ic-line-horizontal.svg';
import { BackgroundColor, Label, Line, Orange } from '@utils/constant/color';
import { Typography, TypographyToken, typographyCss } from '@utils/constant/typography';

type CheckboxSize = 'small' | 'medium';

export interface CheckboxProps {
  className?: string;
  size?: CheckboxSize;
  checked?: boolean;
  indeterminate?: boolean;
  bold?: boolean;
  tight?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  ariaLabel?: string;
  onChange?: (checked: boolean) => void;
  id?: string;
}

const HIT_TARGET = 26;

const sizeConfig: Record<CheckboxSize, { box: number; icon: number }> = {
  small: { box: 16, icon: 14 },
  medium: { box: 18, icon: 16 },
};

const typographyBySize: Record<CheckboxSize, TypographyToken> = {
  small: Typography.label1Normal.regular,
  medium: Typography.body2Normal.regular,
};

const Checkbox = ({
  className,
  size = 'medium',
  checked = false,
  indeterminate = false,
  bold = false,
  tight = false,
  disabled = false,
  label,
  ariaLabel,
  onChange,
  id,
}: CheckboxProps) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const isFilled = checked || indeterminate;
  const { box, icon } = sizeConfig[size];
  const halloInset = (HIT_TARGET - box) / 2;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <Root className={className}>
      <ControlWrapper $tight={tight}>
        <Box
          as="input"
          ref={inputRef}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          aria-label={!label ? ariaLabel : undefined}
          onChange={(event) => onChange?.(event.target.checked)}
          $box={box}
          $filled={isFilled}
          $disabled={disabled}
        />
        <Indicator $box={box} $filled={isFilled} $disabled={disabled} aria-hidden>
          {indeterminate ? (
            <IcLineHorizontal width={icon} height={icon} />
          ) : checked ? (
            <IcCheck width={icon} height={icon} />
          ) : null}
        </Indicator>
        <Halo $inset={halloInset} />
      </ControlWrapper>
      {label && (
        <LabelText htmlFor={checkboxId} $size={size} $bold={bold} $disabled={disabled}>
          {label}
        </LabelText>
      )}
    </Root>
  );
};

export default Checkbox;

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
  padding: 3px ${(props) => (props.$tight ? 1 : 3)}px;
`;

const Box = styled.input<{ $box: number; $filled: boolean; $disabled: boolean }>`
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
`;

const Indicator = styled.span<{ $box: number; $filled: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$box}px;
  height: ${(props) => props.$box}px;
  border-radius: 5px;
  border: 1.5px solid ${(props) => (props.$filled ? Orange.o500 : Line.strong)};
  background-color: ${(props) => (props.$filled ? Orange.o500 : 'transparent')};
  color: ${BackgroundColor};
  pointer-events: none;

  ${(props) =>
    props.$disabled &&
    css`
      opacity: 0.43;
    `}
`;

const Halo = styled.span<{ $inset: number }>`
  position: absolute;
  inset: -${(props) => props.$inset}px;
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

const LabelText = styled.label<{ $size: CheckboxSize; $bold: boolean; $disabled: boolean }>`
  padding: 1px 0;
  color: ${(props) => (props.$disabled ? Label.disable : Label.normal)};
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  ${(props) => typographyCss(typographyBySize[props.$size])}
  font-weight: ${(props) => (props.$bold ? 600 : 400)};
`;
