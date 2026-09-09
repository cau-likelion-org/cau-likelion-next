import { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { AccentTint, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, TypographyToken, typographyCss } from '@utils/constant/typography';

type ChipVariant = 'filled' | 'outlined';
type ChipSize = 'xsmall' | 'small' | 'medium' | 'large';

export interface ChipProps {
  className?: string;
  variant?: ChipVariant;
  size?: ChipSize;
  active?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const sizeConfig: Record<
  ChipSize,
  { paddingX: number; paddingY: number; radius: number; gap: number; iconSize: number }
> = {
  xsmall: { paddingX: 7, paddingY: 4, radius: 6, gap: 2, iconSize: 12 },
  small: { paddingX: 8, paddingY: 6, radius: 8, gap: 2, iconSize: 14 },
  medium: { paddingX: 11, paddingY: 7, radius: 10, gap: 3, iconSize: 14 },
  large: { paddingX: 12, paddingY: 9, radius: 10, gap: 3, iconSize: 16 },
};

const typographyBySize: Record<ChipSize, TypographyToken> = {
  xsmall: Typography.caption1.medium,
  small: Typography.label1Normal.medium,
  medium: Typography.body2Normal.medium,
  large: Typography.body2Normal.medium,
};

const ACTIVE_BACKGROUND = 'rgba(255, 96, 0, 0.05)';

const getBackgroundColor = (variant: ChipVariant, active: boolean, disabled: boolean) => {
  if (disabled) return variant === 'filled' ? '#F4F4F5' : 'transparent';
  if (active) return ACTIVE_BACKGROUND;
  return variant === 'filled' ? Fill.subtle : 'transparent';
};

const getBorderColor = (variant: ChipVariant, active: boolean, disabled: boolean) => {
  if (!disabled && active) return AccentTint.border;
  return variant === 'outlined' ? Line.normal : undefined;
};

const getTextColor = (active: boolean, disabled: boolean) => {
  if (disabled) return Label.disable;
  if (active) return Orange.o500;
  return Label.alternative;
};

const Chip = ({
  className,
  variant = 'filled',
  size = 'medium',
  active = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  children,
  onClick,
  type = 'button',
}: ChipProps) => {
  const content = (
    <>
      <Interaction $active={active} $size={size} />
      {leadingIcon}
      {children}
      {trailingIcon}
    </>
  );

  if (!onClick) {
    return (
      <StyledChip
        as="span"
        className={className}
        $variant={variant}
        $size={size}
        $active={active}
        $disabled={disabled}
        $interactive={false}
      >
        {content}
      </StyledChip>
    );
  }

  return (
    <StyledChip
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      $variant={variant}
      $size={size}
      $active={active}
      $disabled={disabled}
      $interactive
    >
      {content}
    </StyledChip>
  );
};

export default Chip;

const Interaction = styled.span<{ $active: boolean; $size: ChipSize }>`
  position: absolute;
  inset: 0;
  border-radius: ${(props) => sizeConfig[props.$size].radius}px;
  background-color: ${(props) => (props.$active ? Orange.o500 : Label.normal)};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
`;

const StyledChip = styled.button<{
  $variant: ChipVariant;
  $size: ChipSize;
  $active: boolean;
  $disabled: boolean;
  $interactive: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: none;
  cursor: ${(props) => (props.$interactive ? 'pointer' : 'default')};
  gap: ${(props) => sizeConfig[props.$size].gap}px;
  padding: ${(props) => sizeConfig[props.$size].paddingY}px ${(props) => sizeConfig[props.$size].paddingX}px;
  border-radius: ${(props) => sizeConfig[props.$size].radius}px;
  background-color: ${(props) => getBackgroundColor(props.$variant, props.$active, props.$disabled)};
  color: ${(props) => getTextColor(props.$active, props.$disabled)};
  ${(props) => typographyCss(typographyBySize[props.$size])}

  ${(props) => {
    const borderColor = getBorderColor(props.$variant, props.$active, props.$disabled);
    return (
      borderColor &&
      css`
        box-shadow: inset 0 0 0 1px ${borderColor};
      `
    );
  }}

  ${(props) =>
    props.$interactive &&
    css`
      &:not(:disabled):hover ${Interaction} {
        opacity: 0.04;
      }

      &:not(:disabled):active ${Interaction} {
        opacity: 0.08;
      }

      &:disabled {
        cursor: not-allowed;
      }
    `}
`;
