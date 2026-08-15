import { useState } from 'react';
import styled from 'styled-components';

import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { IcCaretDown } from '@assets/svg';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AssignmentPartSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const AssignmentPartSelect = ({ value, options, onChange }: AssignmentPartSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: onChange,
  });

  return (
    <Wrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Trigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-label="파트 선택"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <TriggerText>{value}</TriggerText>
        <Caret>
          <IcCaretDown width={20} height={20} />
        </Caret>
      </Trigger>
      {isOpen && (
        <ListboxOptions
          listId={listId}
          options={options}
          value={value}
          activeIndex={activeIndex}
          onSelect={selectOption}
        />
      )}
    </Wrapper>
  );
};

export default AssignmentPartSelect;

const Wrapper = styled.div`
  position: relative;
`;

const Trigger = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  color: ${Label.strong};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  ${typographyCss(Typography.headline2.medium)}

  /* Figma: 텍스트 좌우로 7px 넓은 6px 라운드 회색(검정 4%) 배경 */
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
    opacity: 0.04;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:hover::before {
    opacity: 0.08;
  }
`;

const TriggerText = styled.span`
  position: relative;
`;

// 텍스트는 Label/Strong(#000)이지만 캐럿만 Label/Alternative로 흐리다
const Caret = styled.span`
  position: relative;
  display: inline-flex;
  color: ${Label.alternative};
`;
