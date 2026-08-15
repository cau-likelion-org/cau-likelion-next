import { useState } from 'react';
import styled from 'styled-components';

import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { IcChevronDown } from '@assets/svg';
import { BackgroundWhite, Label } from '@utils/constant/color';
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
        <span>{value}</span>
        <IcChevronDown width={16} height={16} />
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
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${BackgroundWhite.tertiary};
  color: ${Label.normal};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  ${typographyCss(Typography.body2Normal.medium)}
`;
