import { useRef } from 'react';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { AccentTint, BackgroundColor, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import type { TypographyToken } from '@utils/constant/typography';

type SegmentedControlVariant = 'filled' | 'outlined';
type SegmentedControlSize = 'small' | 'medium' | 'large';

export interface SegmentedControlOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  className?: string;
  variant?: SegmentedControlVariant;
  size?: SegmentedControlSize;
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
}

const sizeConfig: Record<
  SegmentedControlSize,
  { height: number; padding: number; outerRadius: number; innerRadius: number; font: TypographyToken }
> = {
  small: {
    height: 32,
    padding: 2,
    outerRadius: 8,
    innerRadius: 6,
    font: { ...Typography.label2.bold, fontWeight: 500 },
  },
  medium: { height: 40, padding: 2, outerRadius: 10, innerRadius: 8, font: Typography.body2Normal.medium },
  large: { height: 48, padding: 3, outerRadius: 12, innerRadius: 10, font: Typography.headline2.medium },
};

const SegmentedControl = ({
  className,
  variant = 'filled',
  size = 'large',
  options,
  value,
  onChange,
  disabled = false,
  ...rest
}: SegmentedControlProps) => {
  const config = sizeConfig[size];
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveFocus = (fromIndex: number, delta: number) => {
    const nextIndex = (fromIndex + delta + options.length) % options.length;
    onChange(options[nextIndex].value);
    segmentRefs.current[nextIndex]?.focus();
  };

  return (
    <Container
      className={className}
      role="tablist"
      aria-label={rest['aria-label']}
      $variant={variant}
      $height={config.height}
      $padding={variant === 'filled' ? config.padding : 0}
      $radius={config.outerRadius}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <Segment
            key={option.value}
            ref={(node) => {
              segmentRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') {
                event.preventDefault();
                moveFocus(index, 1);
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                moveFocus(index, -1);
              }
            }}
            $variant={variant}
            $active={active}
            $radius={config.innerRadius}
            $isFirst={index === 0}
            $isLast={index === options.length - 1}
            $showDivider={variant === 'outlined' && !active && index < options.length - 1}
          >
            {option.icon}
            <Label_ $variant={variant} $active={active} $disabled={disabled} $font={config.font}>
              {option.label}
            </Label_>
          </Segment>
        );
      })}
    </Container>
  );
};

export default SegmentedControl;

interface ContainerProps {
  $variant: SegmentedControlVariant;
  $height: number;
  $padding: number;
  $radius: number;
}

const Container = styled.div<ContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => props.$height}px;
  padding: ${(props) => props.$padding}px;
  border-radius: ${(props) => props.$radius}px;
  overflow: hidden;

  ${(props) =>
    props.$variant === 'filled'
      ? css`
          background-color: ${Fill.normal};
        `
      : css`
          box-shadow: inset 0 0 0 1px ${Line.normal};
        `}
`;

const Segment = styled.button<{
  $variant: SegmentedControlVariant;
  $active: boolean;
  $radius: number;
  $isFirst: boolean;
  $isLast: boolean;
  $showDivider: boolean;
}>`
  position: relative;
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 9px;
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  ${(props) =>
    props.$variant === 'filled' &&
    props.$active &&
    css`
      border-radius: ${props.$radius}px;
      background-color: ${BackgroundColor};
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
    `}

  ${(props) =>
    props.$variant === 'outlined' &&
    props.$active &&
    css`
      border-radius: ${props.$isFirst ? props.$radius : 0}px ${props.$isLast ? props.$radius : 0}px
        ${props.$isLast ? props.$radius : 0}px ${props.$isFirst ? props.$radius : 0}px;
      background-color: rgba(255, 96, 0, 0.05);
      box-shadow: inset 0 0 0 1px ${AccentTint.border};
    `}

  ${(props) =>
    props.$showDivider &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 1px;
        bottom: 1px;
        right: 0;
        border-right: 1px solid ${Line.normal};
      }
    `}
`;

const Label_ = styled.span<{
  $variant: SegmentedControlVariant;
  $active: boolean;
  $disabled: boolean;
  $font: TypographyToken;
}>`
  flex: 1 0 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  color: ${(props) => {
    if (props.$disabled) return Label.disable;
    if (!props.$active) return Label.alternative;
    return props.$variant === 'outlined' ? Orange.o500 : Label.normal;
  }};
  ${(props) => typographyCss(props.$font)}
`;
