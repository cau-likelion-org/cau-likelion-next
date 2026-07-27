import styled from 'styled-components';

import { Label, Line } from '@utils/constant/color';

export interface TabItem {
  key: string;
  label: string;
}

export interface TabProps {
  className?: string;
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  resize?: 'hug' | 'fill';
  size?: 'small' | 'medium' | 'large';
  horizontalPadding?: boolean;
}

const SIZE_STYLE = {
  small: { height: 40, fontSize: 15, lineHeight: 1.467, letterSpacing: '0.144px' },
  medium: { height: 48, fontSize: 17, lineHeight: 1.412, letterSpacing: '0px' },
  large: { height: 56, fontSize: 20, lineHeight: 1.4, letterSpacing: '-0.24px' },
} as const;

const Tab = ({
  className,
  items,
  activeKey,
  onChange,
  resize = 'hug',
  size = 'small',
  horizontalPadding = false,
}: TabProps) => {
  return (
    <List className={className} role="tablist" size={size} horizontalPadding={horizontalPadding}>
      {items.map((item) => {
        const selected = item.key === activeKey;
        return (
          <TabButton
            key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            resize={resize}
            size={size}
            selected={selected}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </TabButton>
        );
      })}
    </List>
  );
};

export default Tab;

const List = styled.div<{ size: TabProps['size']; horizontalPadding: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  height: ${(props) => SIZE_STYLE[props.size ?? 'small'].height}px;
  padding: 0 ${(props) => (props.horizontalPadding ? '20px' : '0')};
  border-bottom: 1px solid ${Line.subtle};
`;

const TabButton = styled.button<{
  resize: TabProps['resize'];
  size: TabProps['size'];
  selected: boolean;
}>`
  position: relative;
  flex: ${(props) => (props.resize === 'fill' ? '1 0 0' : '0 0 auto')};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 100%;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: ${(props) => SIZE_STYLE[props.size ?? 'small'].fontSize}px;
  line-height: ${(props) => SIZE_STYLE[props.size ?? 'small'].lineHeight};
  letter-spacing: ${(props) => SIZE_STYLE[props.size ?? 'small'].letterSpacing};
  color: ${(props) => (props.selected ? Label.strong : Label.assistive)};

  &::before {
    content: '';
    position: absolute;
    inset: 0 -12px;
    background-color: ${Label.normal};
    opacity: 0;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 0.08;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: ${Label.strong};
    opacity: ${(props) => (props.selected ? 1 : 0)};
  }
`;
