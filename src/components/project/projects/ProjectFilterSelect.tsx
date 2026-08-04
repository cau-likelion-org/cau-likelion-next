import { useState } from 'react';
import styled from 'styled-components';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';

interface ProjectFilterSelectProps {
  heading: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const ProjectFilterSelect = ({ heading, options, value, onChange }: ProjectFilterSelectProps) => {
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
      <Select
        ref={triggerRef}
        heading={heading}
        value={value}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
      />
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

export default ProjectFilterSelect;

const Wrapper = styled.div`
  position: relative;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
