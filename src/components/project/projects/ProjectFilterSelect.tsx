import Select from '@common/select/Select';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface ProjectFilterSelectProps {
  heading: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const ProjectFilterSelect = ({ heading, options, value, onChange }: ProjectFilterSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const activeIndex = Math.max(options.indexOf(value), 0);
    optionRefs.current[activeIndex]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect(options[index]);
      return;
    }
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      optionRefs.current[(index + 1) % options.length]?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      optionRefs.current[(index - 1 + options.length) % options.length]?.focus();
    }
  };

  return (
    <Wrapper ref={wrapperRef}>
      <Select heading={heading} value={value} onClick={() => setIsOpen((prev) => !prev)} aria-expanded={isOpen} />
      {isOpen && (
        <OptionList role="listbox">
          {options.map((option, index) => (
            <Option
              key={option}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              tabIndex={-1}
              aria-selected={option === value}
              $active={option === value}
              onClick={() => handleSelect(option)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
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
`;

const OptionList = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(23, 23, 23, 0.12);
  box-sizing: border-box;
`;

const Option = styled.li<{ $active: boolean }>`
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) => (props.$active ? Label.normal : Label.alternative)};
  background-color: ${(props) => (props.$active ? Line.alternative : 'transparent')};
  ${typographyCss(Typography.body1Normal.regular)}

  &:hover {
    background-color: ${Line.alternative};
  }
`;
