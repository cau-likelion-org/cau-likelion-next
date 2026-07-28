import styled from 'styled-components';

import { CategoryTint, Inverse, Label, Line, System } from '@utils/constant/color';

export interface CategoryItem {
  key: string;
  label: string;
}

export interface CategoryProps {
  className?: string;
  items: CategoryItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: 'normal' | 'alternative';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  horizontalPadding?: boolean;
  verticalPadding?: boolean;
}

const SIZE_STYLE = {
  small: {
    gap: 4,
    paddingX: 7,
    paddingY: 4,
    radius: 6,
    fontSize: 12,
    lineHeight: 1.334,
    letterSpacing: '0.3024px',
    verticalPadding: 8,
  },
  medium: {
    gap: 6,
    paddingX: 8,
    paddingY: 6,
    radius: 8,
    fontSize: 14,
    lineHeight: 1.429,
    letterSpacing: '0.203px',
    verticalPadding: 8,
  },
  large: {
    gap: 8,
    paddingX: 11,
    paddingY: 7,
    radius: 10,
    fontSize: 15,
    lineHeight: 1.467,
    letterSpacing: '0.144px',
    verticalPadding: 10,
  },
  xlarge: {
    gap: 10,
    paddingX: 12,
    paddingY: 9,
    radius: 10,
    fontSize: 15,
    lineHeight: 1.467,
    letterSpacing: '0.144px',
    verticalPadding: 10,
  },
} as const;

const Category = ({
  className,
  items,
  activeKey,
  onChange,
  variant = 'normal',
  size = 'medium',
  horizontalPadding = false,
  verticalPadding = false,
}: CategoryProps) => {
  const style = SIZE_STYLE[size];

  return (
    <List
      className={className}
      role="tablist"
      gap={style.gap}
      horizontalPadding={horizontalPadding}
      verticalPadding={verticalPadding ? style.verticalPadding : 0}
    >
      {items.map((item) => {
        const selected = item.key === activeKey;
        return (
          <Chip
            key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            variant={variant}
            selected={selected}
            $style={style}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </Chip>
        );
      })}
    </List>
  );
};

export default Category;

const List = styled.div<{ gap: number; horizontalPadding: boolean; verticalPadding: number }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${(props) => props.gap}px;
  padding: ${(props) => props.verticalPadding}px ${(props) => (props.horizontalPadding ? 20 : 0)}px;
`;

const Chip = styled.button<{
  variant: CategoryProps['variant'];
  selected: boolean;
  $style: (typeof SIZE_STYLE)[keyof typeof SIZE_STYLE];
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  padding: ${(props) => props.$style.paddingY}px ${(props) => props.$style.paddingX}px;
  border-radius: ${(props) => props.$style.radius}px;
  font-size: ${(props) => props.$style.fontSize}px;
  line-height: ${(props) => props.$style.lineHeight};
  letter-spacing: ${(props) => props.$style.letterSpacing};

  ${(props) => {
    if (props.selected && props.variant === 'alternative') {
      return `
        border: 1px solid ${CategoryTint.border};
        background-color: ${CategoryTint.background};
        color: ${System.blue};
      `;
    }
    if (props.selected) {
      return `
        border: 1px solid transparent;
        background-color: ${Label.strong};
        color: ${Inverse.label};
      `;
    }
    return `
      border: 1px solid ${Line.normal};
      background-color: transparent;
      color: ${Label.alternative};
    `;
  }}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
    background-color: ${(props) =>
      props.selected ? (props.variant === 'alternative' ? System.blue : Inverse.label) : Label.normal};
  }

  &:hover::before {
    opacity: 0.08;
  }
`;
