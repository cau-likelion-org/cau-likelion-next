import { KeyboardEvent, useState } from 'react';
import styled from 'styled-components';

import Chip from '@common/chip/Chip';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TechStackInput = ({
  value,
  onChange,
  placeholder = '이름을 입력해 주세요.',
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) => {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  };

  const removeTag = (tag: string) => onChange(value.filter((item) => item !== tag));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== ' ' && event.key !== ',') return;
    event.preventDefault();
    addTag();
  };

  return (
    <Wrapper>
      {value.map((tag) => (
        <Chip key={tag} size="medium" trailingIcon={<RemoveIcon>×</RemoveIcon>} onClick={() => removeTag(tag)}>
          {tag}
        </Chip>
      ))}
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ''}
      />
    </Wrapper>
  );
};

export default TechStackInput;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const Input = styled.input`
  flex: 1 0 80px;
  min-width: 0;
  border: none;
  outline: none;
  background: none;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;

const RemoveIcon = styled.span`
  font-size: 12px;
  line-height: 1;
`;
