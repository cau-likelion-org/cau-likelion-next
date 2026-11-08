import { useState } from 'react';
import styled from 'styled-components';

import { FieldStatus } from '@common/fieldStatus/FieldStatus';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';

import { applyFieldHeadingCss } from './applyFieldStyle';

export interface ApplySelectProps {
  heading: string;
  options: string[];
  value: string;
  status?: FieldStatus;
  description?: string;
  onChange: (value: string) => void;
}

const ApplySelect = ({ heading, options, value, status, description, onChange }: ApplySelectProps) => {
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
    <div ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <StyledSelect
        ref={triggerRef}
        heading={heading}
        required
        aria-label={heading}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        placeholder="선택해주세요"
        value={value}
        status={status}
        description={description}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen && (
          <ListboxOptions
            listId={listId}
            options={options}
            value={value}
            activeIndex={activeIndex}
            onSelect={selectOption}
          />
        )}
      </StyledSelect>
    </div>
  );
};

export default ApplySelect;

const StyledSelect = styled(Select)`
  ${applyFieldHeadingCss}
`;
