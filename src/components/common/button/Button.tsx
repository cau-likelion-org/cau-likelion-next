import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import CircularLoading from '@common/loading/CircularLoading';
import { BackgroundColor, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, TypographyToken, typographyCss } from '@utils/constant/typography';

type ButtonVariant = 'solid' | 'outlined';
type ButtonColor = 'primary' | 'assistive';
type ButtonSize = 'large' | 'medium' | 'small';

interface ButtonBaseProps {
  className?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export type ButtonProps =
  | (ButtonBaseProps & { iconOnly?: false; children: ReactNode; leadingIcon?: ReactNode; trailingIcon?: ReactNode })
  | (ButtonBaseProps & { iconOnly: true; icon: ReactNode; 'aria-label': string });

const sizeConfig: Record<
  ButtonSize,
  {
    paddingX: number;
    paddingY: number;
    radius: number;
    gap: number;
    iconSize: number;
    iconOnlyBox: number;
    iconOnlyPadding: number;
  }
> = {
  large: { paddingX: 28, paddingY: 12, radius: 12, gap: 6, iconSize: 20, iconOnlyBox: 48, iconOnlyPadding: 12 },
  medium: { paddingX: 20, paddingY: 9, radius: 10, gap: 5, iconSize: 18, iconOnlyBox: 40, iconOnlyPadding: 10 },
  small: { paddingX: 14, paddingY: 7, radius: 8, gap: 4, iconSize: 16, iconOnlyBox: 32, iconOnlyPadding: 8 },
};

const typographyBySize: Record<ButtonSize, Record<ButtonColor, TypographyToken>> = {
  large: { primary: Typography.body1Normal.bold, assistive: Typography.body1Normal.medium },
  medium: { primary: Typography.body2Normal.bold, assistive: Typography.body2Normal.medium },
  small: { primary: Typography.label2.bold, assistive: { ...Typography.label2.bold, fontWeight: 500 } },
};

const getBackgroundColor = (variant: ButtonVariant, color: ButtonColor, disabled: boolean) => {
  if (disabled) return variant === 'solid' ? '#F4F4F5' : 'transparent';
  if (variant === 'outlined') return 'transparent';
  return color === 'primary' ? Orange.o500 : Fill.normal;
};

const getTextColor = (variant: ButtonVariant, color: ButtonColor, disabled: boolean) => {
  if (disabled) return Label.assistive;
  if (variant === 'solid') return color === 'primary' ? BackgroundColor : Label.neutral;
  return color === 'primary' ? Orange.o500 : Label.normal;
};

const Button = (props: ButtonProps) => {
  const {
    className,
    variant = 'solid',
    color = 'primary',
    size = 'large',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
  } = props;

  return (
    <StyledButton
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={props.iconOnly ? props['aria-label'] : undefined}
      $variant={variant}
      $color={color}
      $size={size}
      $iconOnly={props.iconOnly ?? false}
      $disabled={disabled}
    >
      {loading ? (
        <CircularLoading size={sizeConfig[size].iconSize} color={getTextColor(variant, color, disabled)} />
      ) : props.iconOnly ? (
        props.icon
      ) : (
        <>
          {props.leadingIcon}
          {props.children}
          {props.trailingIcon}
        </>
      )}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $color: ButtonColor;
  $size: ButtonSize;
  $iconOnly: boolean;
  $disabled: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-shrink: 0;
  gap: ${(props) => sizeConfig[props.$size].gap}px;
  overflow: hidden;
  border: none;
  cursor: pointer;
  background-color: ${(props) => getBackgroundColor(props.$variant, props.$color, props.$disabled)};
  color: ${(props) => getTextColor(props.$variant, props.$color, props.$disabled)};
  ${(props) => typographyCss(typographyBySize[props.$size][props.$color])}

  ${(props) =>
    props.$iconOnly
      ? css`
          width: ${sizeConfig[props.$size].iconOnlyBox}px;
          height: ${sizeConfig[props.$size].iconOnlyBox}px;
          padding: ${sizeConfig[props.$size].iconOnlyPadding}px;
        `
      : css`
          padding: ${sizeConfig[props.$size].paddingY}px ${sizeConfig[props.$size].paddingX}px;
        `}
  border-radius: ${(props) => sizeConfig[props.$size].radius}px;

  ${(props) =>
    props.$variant === 'outlined' &&
    css`
      box-shadow: inset 0 0 0 1px ${Line.normal};
    `}

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: ${Label.normal};
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:not(:disabled):hover::after {
    opacity: ${(props) => (props.$variant === 'solid' ? 0.08 : 0.04)};
  }

  &:not(:disabled):active::after {
    opacity: ${(props) => (props.$variant === 'solid' ? 0.16 : 0.08)};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
