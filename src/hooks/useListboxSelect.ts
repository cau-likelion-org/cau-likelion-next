import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import useOutsideClick from './useOutsideClick';

export interface UseListboxSelectParams {
  isOpen: boolean;
  options: string[];
  value: string;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (option: string) => void;
}

const useListboxSelect = ({ isOpen, options, value, onOpen, onClose, onSelect }: UseListboxSelectParams) => {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(options.indexOf(value), 0));

  useOutsideClick(wrapperRef, onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setActiveIndex(Math.max(options.indexOf(value), 0)), 0);
    return () => clearTimeout(timer);
  }, [isOpen, value, options]);

  const moveActive = (nextIndex: number) => {
    setActiveIndex(Math.min(Math.max(nextIndex, 0), options.length - 1));
  };

  const selectOption = (option: string, index: number) => {
    setActiveIndex(index);
    onSelect(option);
    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' ', 'Escape', 'Home', 'End'].includes(event.key)) {
      event.stopPropagation();
    }

    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        moveActive(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveActive(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        moveActive(0);
        break;
      case 'End':
        event.preventDefault();
        moveActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectOption(options[activeIndex], activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  };

  return { listId, wrapperRef, activeIndex, handleKeyDown, selectOption };
};

export default useListboxSelect;
