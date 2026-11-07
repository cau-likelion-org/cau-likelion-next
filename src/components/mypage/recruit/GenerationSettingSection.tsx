import { useState } from 'react';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import Button from '@common/button/Button';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitGenerationSetting } from './mock';

export interface GenerationSettingSectionProps {
  initialValues: RecruitGenerationSetting;
  onSave: (values: RecruitGenerationSetting, isUpdate: boolean) => void;
}

const toDigits = (value: string) => value.replace(/\D/g, '');

const isFilled = (values: RecruitGenerationSetting) =>
  values.generation !== '' && values.partQuotas.every((part) => part.quota !== '');

const GenerationSettingSection = ({ initialValues, onSave }: GenerationSettingSectionProps) => {
  const [values, setValues] = useState(initialValues);
  const [savedValues, setSavedValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(!isFilled(initialValues));

  const hasSaved = isFilled(savedValues);

  const handleSave = () => {
    onSave(values, hasSaved);
    setSavedValues(values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValues(savedValues);
    setIsEditing(false);
  };

  const updateQuota = (partId: number, quota: string) => {
    setValues((prev) => ({
      ...prev,
      partQuotas: prev.partQuotas.map((part) => (part.partId === partId ? { ...part, quota } : part)),
    }));
  };

  return (
    <Wrapper>
      <Field>
        <SectionTitle>모집 기수</SectionTitle>
        <TextField
          aria-label="모집 기수"
          inputMode="numeric"
          placeholder="숫자로 입력해주세요."
          value={values.generation}
          readOnly={!isEditing}
          onChange={(event) => setValues((prev) => ({ ...prev, generation: toDigits(event.target.value) }))}
          trailingContent={<Unit>기</Unit>}
        />
      </Field>
      <QuotaGroup>
        <SectionTitle>파트별 모집 정원</SectionTitle>
        <Card>
          {values.partQuotas.map((part) => (
            <TextField
              key={part.partId}
              heading={part.partName}
              inputMode="numeric"
              placeholder="숫자로 입력해주세요."
              value={part.quota}
              readOnly={!isEditing}
              onChange={(event) => updateQuota(part.partId, toDigits(event.target.value))}
              trailingContent={<Unit>명</Unit>}
            />
          ))}
          <Caption>전체회원/파트관리 페이지에서 설정한 파트만 불러와집니다.</Caption>
        </Card>
      </QuotaGroup>
      <Actions>
        {isEditing ? (
          <>
            {hasSaved && (
              <Button color="assistive" onClick={handleCancel}>
                취소
              </Button>
            )}
            <Button disabled={!isFilled(values)} onClick={handleSave}>
              저장
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            수정
          </Button>
        )}
      </Actions>
    </Wrapper>
  );
};

export default GenerationSettingSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 38px 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const QuotaGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};
`;

const Unit = styled.span`
  flex-shrink: 0;
  padding: 0 4px;
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Caption = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  width: 100%;
`;
