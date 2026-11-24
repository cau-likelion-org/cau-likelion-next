import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import TextButton from '@common/textButton/TextButton';
import TechStackInput from '@mypage/admin/component/TechStackInput';
import { IcAdd } from '@assets/svg';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface ExtraPart {
  id: number;
  name: string;
  members: string[];
}

const ExtraPartFields = ({
  parts,
  onChange,
  nextId,
}: {
  parts: ExtraPart[];
  onChange: Dispatch<SetStateAction<ExtraPart[]>>;
  nextId: () => number;
}) => {
  const handleAddPart = () => {
    onChange((prev) => [...prev, { id: nextId(), name: '', members: [] }]);
  };

  const handleRemovePart = (id: number) => {
    onChange((prev) => prev.filter((part) => part.id !== id));
  };

  return (
    <>
      {parts.map((part) => (
        <ExtraPartGroup key={part.id}>
          <ExtraPartHeaderRow>
            <PartNameInput
              placeholder="파트 이름 입력"
              value={part.name}
              onChange={(event) =>
                onChange((prev) => prev.map((p) => (p.id === part.id ? { ...p, name: event.target.value } : p)))
              }
            />
            <TextButton size="small" color="assistive" onClick={() => handleRemovePart(part.id)}>
              삭제
            </TextButton>
          </ExtraPartHeaderRow>
          <TechStackInput
            placeholder="텍스트 입력 후 띄어쓰기"
            value={part.members}
            onChange={(members) => onChange((prev) => prev.map((p) => (p.id === part.id ? { ...p, members } : p)))}
          />
        </ExtraPartGroup>
      ))}
      <Button
        variant="solid"
        color="assistive"
        size="medium"
        trailingIcon={<IcAdd width={16} height={16} />}
        onClick={handleAddPart}
      >
        파트 추가
      </Button>
    </>
  );
};

export default ExtraPartFields;

const ExtraPartGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const ExtraPartHeaderRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const PartNameInput = styled.input`
  flex-shrink: 0;
  width: 94px;
  padding: 4px 6px;
  margin: 0 -6px;
  border: none;
  border-radius: 6px;
  outline: none;
  background-color: rgba(0, 0, 0, 0.04);
  color: ${Label.normal};
  ${typographyCss(Typography.label1Normal.medium)}

  &::placeholder {
    color: ${Label.assistive};
  }
`;
