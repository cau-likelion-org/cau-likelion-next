import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';

interface ProjectFilterSelectProps {
  className?: string;
  heading?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  status?: 'normal' | 'positive' | 'negative';
  description?: string;
  leadingIcon?: ReactNode;
  hideValue?: boolean;
}

const ProjectFilterSelect = ({
  className,
  heading = '',
  options,
  value,
  onChange,
  required,
  status,
  description,
  leadingIcon,
  hideValue,
}: ProjectFilterSelectProps) => {
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
    <Wrapper className={className} ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        heading={heading}
        required={required}
        value={value}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
        status={status}
        description={description}
        leadingIcon={leadingIcon}
        hideValue={hideValue}
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

  @media (max-width: 600px) {
    flex: 1 0 0;
    min-width: 0;
    width: auto;
  }
`;
