import { useState } from 'react';
import styled from 'styled-components';

import Select from '@common/select/Select';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { BackgroundColor, Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

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
        <OptionList role="listbox" id={listId}>
          {options.map((option, index) => (
            <Option
              key={option}
              id={`${listId}-${index}`}
              type="button"
              role="option"
              aria-selected={option === value}
              $active={index === activeIndex}
              onClick={() => selectOption(option, index)}
            >
              {option}
            </Option>
          ))}
        </OptionList>
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

const OptionList = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 12px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);
  z-index: 1;
`;

const Option = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => (props.$active ? Fill.subtle : 'transparent')};
  text-align: left;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}

  &:hover {
    background-color: ${Fill.subtle};
  }
`;
