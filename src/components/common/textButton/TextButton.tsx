import { ReactNode } from 'react';
import styled from 'styled-components';

import CircularLoading from '@common/loading/CircularLoading';
import { Label, Orange } from '@utils/constant/color';
import { Typography, TypographyToken, typographyCss } from '@utils/constant/typography';

type TextButtonColor = 'primary' | 'assistive';
type TextButtonSize = 'large' | 'small';

export interface TextButtonProps {
  className?: string;
  color?: TextButtonColor;
  size?: TextButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

const sizeConfig: Record<TextButtonSize, { hitHeight: number; hitInset: number; iconSize: number }> = {
  large: { hitHeight: 32, hitInset: 7, iconSize: 20 },
  small: { hitHeight: 28, hitInset: 6, iconSize: 16 },
};

const typographyBySize: Record<TextButtonSize, TypographyToken> = {
  large: Typography.body1Normal.bold,
  small: Typography.label1Normal.bold,
};

const getTextColor = (color: TextButtonColor, disabled: boolean) => {
  if (disabled) return Label.disable;
  return color === 'primary' ? Orange.o500 : Label.alternative;
};

const TextButton = ({
  className,
  color = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  onClick,
  type = 'button',
}: TextButtonProps) => {
  return (
    <StyledButton
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      $color={color}
      $size={size}
      $disabled={disabled}
    >
      <Interaction $color={color} $size={size} />
      {loading ? (
        <CircularLoading size={sizeConfig[size].iconSize} color={getTextColor(color, disabled)} />
      ) : (
        <>
          {leadingIcon}
          {children}
          {trailingIcon}
        </>
      )}
    </StyledButton>
  );
};

export default TextButton;

const Interaction = styled.span<{ $color: TextButtonColor; $size: TextButtonSize }>`
  position: absolute;
  top: 50%;
  left: ${(props) => -sizeConfig[props.$size].hitInset}px;
  right: ${(props) => -sizeConfig[props.$size].hitInset}px;
  height: ${(props) => sizeConfig[props.$size].hitHeight}px;
  transform: translateY(-50%);
  border-radius: 6px;
  background-color: ${(props) => (props.$color === 'primary' ? Orange.o500 : Label.normal)};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
`;

const StyledButton = styled.button<{
  $color: TextButtonColor;
  $size: TextButtonSize;
  $disabled: boolean;
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => getTextColor(props.$color, props.$disabled)};
  ${(props) => typographyCss(typographyBySize[props.$size])}

  &:not(:disabled):hover ${Interaction} {
    opacity: 0.08;
  }

  &:not(:disabled):active ${Interaction} {
    opacity: 0.16;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
