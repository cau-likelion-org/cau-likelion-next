import { KeyboardEvent, RefObject, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import Menu from '@common/menu/Menu';
import { IcCaretDown, IcCaretUp } from '@assets/svg';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface TextSelectProps {
  className?: string;
  ariaLabel: string;
  options: string[];
  value: string;
  placeholder?: string;
  // 헤더용은 눌러 볼 수 있다는 표시로 평소에도 옅은 배경을 둔다
  tone?: 'header' | 'cell';
  anchorRef?: RefObject<HTMLElement>;
  onChange: (value: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

const MENU_GAP = 4;

const TextSelect = ({
  className,
  ariaLabel,
  options,
  value,
  placeholder,
  tone = 'header',
  anchorRef,
  onChange,
  onOpenChange,
}: TextSelectProps) => {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const changeOpen = (next: boolean) => {
    setIsOpen(next);
    onOpenChange?.(next);
  };

  const open = () => {
    const rect = (anchorRef?.current ?? wrapperRef.current)?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.bottom + MENU_GAP, left: rect.left });
    setActiveIndex(Math.max(options.indexOf(value), 0));
    changeOpen(true);
  };
  const close = () => changeOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener('mousedown', handlePointer);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const select = (index: number) => {
    setActiveIndex(index);
    onChange(options[index]);
    close();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }
    const lastIndex = options.length - 1;
    const keyActions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((prev) => Math.min(prev + 1, lastIndex)),
      ArrowUp: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(lastIndex),
      Enter: () => select(activeIndex),
      ' ': () => select(activeIndex),
      Escape: close,
      Tab: close,
    };
    const action = keyActions[event.key];
    if (!action) return;
    if (event.key !== 'Tab') event.preventDefault();
    action();
  };

  return (
    <Root ref={wrapperRef} className={className}>
      <Trigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        $tone={tone}
        $open={isOpen}
        $placeholder={!value}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
      >
        <TriggerText>{value || placeholder}</TriggerText>
        <Caret>{isOpen ? <IcCaretUp width={20} height={20} /> : <IcCaretDown width={20} height={20} />}</Caret>
      </Trigger>
      {isOpen &&
        position &&
        createPortal(
          <MenuPositioner ref={menuRef} id={listId} role="listbox" style={{ top: position.top, left: position.left }}>
            <Menu
              items={options.map((option, index) => ({
                id: `${listId}-${index}`,
                label: option,
                selected: option === value,
                active: index === activeIndex,
                onClick: () => select(index),
              }))}
            />
          </MenuPositioner>,
          document.body,
        )}
    </Root>
  );
};

export default TextSelect;

const Root = styled.div`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.div<{ $tone: 'header' | 'cell'; $open: boolean; $placeholder: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  color: ${(props) => (props.$placeholder ? Label.assistive : Label.strong)};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  ${typographyCss(Typography.headline2.medium)}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -7px;
    right: -7px;
    height: 32px;
    transform: translateY(-50%);
    border-radius: 6px;
    background-color: ${Label.strong};
    opacity: ${(props) => (props.$open ? 0.06 : props.$tone === 'header' ? 0.04 : 0)};
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:hover::before {
    opacity: ${(props) => (props.$open ? 0.06 : 0.04)};
  }

  &:focus-visible::before {
    opacity: 0.06;
  }
`;

const TriggerText = styled.span`
  position: relative;
`;

const Caret = styled.span`
  position: relative;
  display: inline-flex;
  color: ${Label.alternative};
`;

const MenuPositioner = styled.div`
  position: fixed;
  z-index: 1000;
`;
