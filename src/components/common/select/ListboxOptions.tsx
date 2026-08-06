import styled from 'styled-components';

import { BackgroundColor, Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface ListboxOptionsProps {
  listId: string;
  options: string[];
  value: string;
  activeIndex: number;
  onSelect: (option: string, index: number) => void;
}

const ListboxOptions = ({ listId, options, value, activeIndex, onSelect }: ListboxOptionsProps) => {
  return (
    <OptionList role="listbox" id={listId}>
      {options.map((option, index) => (
        <Option
          key={option}
          id={`${listId}-${index}`}
          type="button"
          role="option"
          aria-selected={value === option}
          $active={index === activeIndex}
          onClick={() => onSelect(option, index)}
        >
          {option}
        </Option>
      ))}
    </OptionList>
  );
};

export default ListboxOptions;

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
