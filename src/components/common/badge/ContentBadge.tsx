import type { ReactNode } from 'react';
import styled from 'styled-components';

import { AccentTint, Fill, Label, Line, Orange } from '@utils/constant/color';

export interface ContentBadgeProps {
  className?: string;
  text: string;
  color?: 'neutral' | 'accent';
  variant?: 'solid' | 'outlined';
  size?: 'xsmall' | 'small' | 'medium';
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const SIZE_STYLE = {
  xsmall: {
    paddingX: 6,
    paddingY: 3,
    radius: 6,
    gap: 2,
    fontSize: 11,
    lineHeight: 1.273,
    letterSpacing: '0.3421px',
    iconSize: 12,
  },
  small: {
    paddingX: 6,
    paddingY: 4,
    radius: 6,
    gap: 3,
    fontSize: 12,
    lineHeight: 1.334,
    letterSpacing: '0.3024px',
    iconSize: 14,
  },
  medium: {
    paddingX: 8,
    paddingY: 5,
    radius: 8,
    gap: 4,
    fontSize: 13,
    lineHeight: 1.385,
    letterSpacing: '0.2522px',
    iconSize: 16,
  },
} as const;

const ContentBadge = ({
  className,
  text,
  color = 'neutral',
  variant = 'solid',
  size = 'small',
  leadingIcon,
  trailingIcon,
}: ContentBadgeProps) => {
  const style = SIZE_STYLE[size];

  return (
    <Badge className={className} color={color} variant={variant} style={style}>
      {leadingIcon && (
        <IconWrapper color={color} size={style.iconSize}>
          {leadingIcon}
        </IconWrapper>
      )}
      <Text color={color} style={style}>
        {text}
      </Text>
      {trailingIcon && (
        <IconWrapper color={color} size={style.iconSize}>
          {trailingIcon}
        </IconWrapper>
      )}
    </Badge>
  );
};

export default ContentBadge;

const Badge = styled.span<{
  color: ContentBadgeProps['color'];
  variant: ContentBadgeProps['variant'];
  style: (typeof SIZE_STYLE)[keyof typeof SIZE_STYLE];
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.style.gap}px;
  padding: ${(props) => props.style.paddingY}px ${(props) => props.style.paddingX}px;
  border-radius: ${(props) => props.style.radius}px;

  ${(props) => {
    if (props.color === 'accent' && props.variant === 'outlined') {
      return `border: 1px solid ${AccentTint.border};`;
    }
    if (props.color === 'accent') {
      return `background-color: ${AccentTint.background};`;
    }
    if (props.variant === 'outlined') {
      return `border: 1px solid ${Line.normal};`;
    }
    return `background-color: ${Fill.normal};`;
  }}
`;

const Text = styled.span<{ color: ContentBadgeProps['color']; style: (typeof SIZE_STYLE)[keyof typeof SIZE_STYLE] }>`
  font-weight: 500;
  white-space: nowrap;
  font-size: ${(props) => props.style.fontSize}px;
  line-height: ${(props) => props.style.lineHeight};
  letter-spacing: ${(props) => props.style.letterSpacing};
  color: ${(props) => (props.color === 'accent' ? Orange.o500 : Label.alternative)};
`;

const IconWrapper = styled.span<{ color: ContentBadgeProps['color']; size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.size}px;
  color: ${(props) => (props.color === 'accent' ? Orange.o500 : Label.alternative)};
`;
