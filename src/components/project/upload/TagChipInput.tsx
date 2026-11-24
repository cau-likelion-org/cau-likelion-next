import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import styled from 'styled-components';

import Chip from '@common/chip/Chip';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { RequiredSmall } from './ProjectUploadForm.styles';

const TAG_SEPARATOR_REGEX = /[\s,]+/;

const TagChipInput = ({
  heading,
  required,
  placeholder,
  values,
  onChange,
}: {
  heading?: string;
  required?: boolean;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const isComposingRef = useRef(false);

  const commitValue = () => {
    const trimmed = inputValue.trim();
    if (trimmed) onChange([...values, trimmed]);
    setInputValue('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!TAG_SEPARATOR_REGEX.test(raw)) {
      setInputValue(raw);
      return;
    }
    const parts = raw.split(TAG_SEPARATOR_REGEX);
    const pending = parts.pop() ?? '';
    const committed = parts.filter(Boolean);
    if (committed.length > 0) onChange([...values, ...committed]);
    setInputValue(pending);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      commitValue();
    } else if (event.key === 'Backspace' && !inputValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <TagInputRoot>
      {heading && (
        <TagInputHeading>
          {heading}
          {required && <RequiredSmall>*</RequiredSmall>}
        </TagInputHeading>
      )}
      <TagInputWrapper>
        {values.map((value, index) => (
          <Chip
            key={`${value}-${index}`}
            size="xsmall"
            trailingIcon={<RemoveIcon>×</RemoveIcon>}
            onClick={() => handleRemove(index)}
          >
            {value}
          </Chip>
        ))}
        <TagTextInput
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          onBlur={commitValue}
          placeholder={values.length === 0 ? placeholder : ''}
        />
      </TagInputWrapper>
    </TagInputRoot>
  );
};

export default TagChipInput;

const TagInputRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const TagInputHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const TagInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 24px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 0 0 1px ${Line.normal},
    0 1px 2px -1px rgba(23, 23, 23, 0.1);

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

const TagTextInput = styled.input`
  flex: 1 0 60px;
  min-width: 60px;
  padding: 0 4px;
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
