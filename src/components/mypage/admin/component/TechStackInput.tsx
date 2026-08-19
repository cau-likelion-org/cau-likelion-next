import { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

import Chip from '@common/chip/Chip';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TechStackInput = ({
  value,
  onChange,
  placeholder = '이름을 입력해 주세요.',
  disabled = false,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const [draft, setDraft] = useState('');

  const removeTag = (tag: string) => onChange(value.filter((item) => item !== tag));

  // keydown에서 스페이스/쉼표를 가로채면, 한글 조합을 끝내는 경계 키의 isComposing 값이
  // 브라우저마다 달라 조합 중이던 글자가 씹히거나 중복되는 문제가 있었다. 스페이스/쉼표는
  // 한글 조합에 절대 포함되지 않는 문자라, onChange로 들어온 문자열에 이미 그 값이 나타난
  // 시점엔 항상 조합이 끝나 있다는 게 보장되므로, 값 자체에서 구분자를 찾아 태그로 분리한다.
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const parts = raw.split(/[ ,]+/);
    if (parts.length === 1) {
      setDraft(raw);
      return;
    }
    const segments = parts
      .slice(0, -1)
      .map((part) => part.trim())
      .filter(Boolean);
    const newTags = Array.from(new Set(segments.filter((part) => !value.includes(part))));
    if (newTags.length > 0) {
      onChange([...value, ...newTags]);
    }
    setDraft(parts[parts.length - 1]);
  };

  return (
    <Wrapper>
      {value.map((tag) =>
        disabled ? (
          <Chip key={tag} size="xsmall">
            {tag}
          </Chip>
        ) : (
          <Chip key={tag} size="xsmall" trailingIcon={<RemoveIcon>×</RemoveIcon>} onClick={() => removeTag(tag)}>
            {tag}
          </Chip>
        ),
      )}
      {!disabled && <Input value={draft} onChange={handleChange} placeholder={value.length === 0 ? placeholder : ''} />}
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
