import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import TextField from '@common/textField/TextField';
import Button from '@common/button/Button';
import { getGenerations } from 'src/apis/account';
import { excludeCommonPart } from '@utils/index';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitGenerationSetting } from './mock';

export interface GenerationSettingSectionProps {
  initialValues: RecruitGenerationSetting;
  onSave: (values: RecruitGenerationSetting, isUpdate: boolean) => void;
}

const toDigits = (value: string) => value.replace(/\D/g, '');

const GenerationSettingSection = ({ initialValues, onSave }: GenerationSettingSectionProps) => {
  const [values, setValues] = useState(initialValues);
  const [savedValues, setSavedValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(initialValues.generation === '');

  const { data: generations } = useQuery({ queryKey: ['adminGenerations'], queryFn: getGenerations });
  const generation = generations?.find((item) => String(item.number) === values.generation);
  const parts = generation ? excludeCommonPart(generation.parts) : [];

  const hasSaved = savedValues.generation !== '';
  const isFilled = parts.length > 0 && parts.every((part) => !!values.quotas[part.id]);

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
    setValues((prev) => ({ ...prev, quotas: { ...prev.quotas, [partId]: quota } }));
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
          {parts.length > 0 ? (
            parts.map((part) => (
              <TextField
                key={part.id}
                heading={part.name}
                inputMode="numeric"
                placeholder="숫자로 입력해주세요."
                value={values.quotas[part.id] ?? ''}
                readOnly={!isEditing}
                onChange={(event) => updateQuota(part.id, toDigits(event.target.value))}
                trailingContent={<Unit>명</Unit>}
              />
            ))
          ) : (
            <EmptyMessage>
              {values.generation === ''
                ? '모집 기수를 입력하면 해당 기수의 파트가 표시됩니다.'
                : `${values.generation}기가 없습니다. 전체회원/파트관리 페이지에서 기수를 먼저 생성해 주세요.`}
            </EmptyMessage>
          )}
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
            <Button disabled={!isFilled} onClick={handleSave}>
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

const EmptyMessage = styled.p`
  margin: 0;
  color: ${Label.alternative};
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
