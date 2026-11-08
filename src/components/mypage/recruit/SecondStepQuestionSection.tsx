import { useRef, useState } from 'react';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import Category from '@common/category/Category';
import { createId } from '@mypage/admin/utils';
import { IcPlus } from '@assets/svg';
import useRequiredFieldsSave from 'src/hooks/useRequiredFieldsSave';
import { Black, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitQuestion, RecruitSecondStepSetting } from './mock';
import QuestionCard, { MIN_CHOICES, isChoiceType } from './QuestionCard';
import RecruitInfoBox, { InfoText } from './RecruitInfoBox';

const LOCK_NOTICE = '접수가 시작되면 문항을 변경할 수 없습니다';

const isQuestionValid = (question: RecruitQuestion) => {
  if (!question.type || question.title.trim() === '') return false;
  if (isChoiceType(question.type)) {
    return question.choices.length >= MIN_CHOICES && question.choices.every((choice) => choice.text.trim() !== '');
  }
  return true;
};

const createEmptyQuestion = (): RecruitQuestion => ({
  id: createId(),
  type: null,
  isRequired: true,
  title: '',
  description: '',
  maxLength: '',
  choices: [],
});

export interface SecondStepQuestionSectionProps {
  initialValues: RecruitSecondStepSetting;
  onSave: (values: RecruitSecondStepSetting, isUpdate: boolean) => void;
}

const SecondStepQuestionSection = ({ initialValues, onSave }: SecondStepQuestionSectionProps) => {
  const [values, setValues] = useState(initialValues);
  const [savedValues, setSavedValues] = useState<RecruitSecondStepSetting | null>(null);
  const [isEditing, setIsEditing] = useState(!initialValues.isLocked);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activePartId, setActivePartId] = useState(initialValues.parts[0]?.partId);

  const readOnly = !isEditing || values.isLocked;
  const activePart = values.parts.find((part) => part.partId === activePartId);
  const questions = activePart?.questions ?? [];
  const isValid = values.parts.every((part) => part.questions.every(isQuestionValid));

  const setQuestions = (next: RecruitQuestion[]) => {
    setValues((prev) => ({
      ...prev,
      parts: prev.parts.map((part) => (part.partId === activePartId ? { ...part, questions: next } : part)),
    }));
  };

  const updateQuestion = (id: string, patch: Partial<RecruitQuestion>) => {
    setQuestions(questions.map((question) => (question.id === id ? { ...question, ...patch } : question)));
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { showErrors, validate, hideErrors } = useRequiredFieldsSave(wrapperRef);

  // 미완성 문항이 있으면 그 파트 탭으로 옮겨 첫 오류 위치를 보여주고, 없으면 저장 확인을 띄운다
  const requestSave = () => {
    if (validate(!isValid)) return setIsConfirmOpen(true);
    const invalidPart = values.parts.find((part) => !part.questions.every(isQuestionValid));
    if (invalidPart) setActivePartId(invalidPart.partId);
  };

  const handleSave = () => {
    setIsConfirmOpen(false);
    onSave(values, !!savedValues);
    setSavedValues(values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    hideErrors();
    if (savedValues) setValues(savedValues);
    setIsEditing(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <PartCategory
        items={values.parts.map((part) => ({ key: String(part.partId), label: part.partName }))}
        activeKey={String(activePartId)}
        onChange={(key) => setActivePartId(Number(key))}
        size="xlarge"
      />
      <RecruitInfoBox title={LOCK_NOTICE}>
        <InfoText>모든 파트에 같은 질문을 넣으려면 파트마다 따로 작성해 주세요.</InfoText>
      </RecruitInfoBox>
      <Group>
        <SectionTitle>문항</SectionTitle>
        {questions.length > 0 && (
          <QuestionList>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                index={index}
                question={question}
                readOnly={readOnly}
                showErrors={showErrors}
                onChange={(patch) => updateQuestion(question.id, patch)}
                onRemove={() => setQuestions(questions.filter((item) => item.id !== question.id))}
              />
            ))}
          </QuestionList>
        )}
        {!readOnly && (
          <Button
            color="assistive"
            trailingIcon={<IcPlus width={20} height={20} />}
            onClick={() => setQuestions([...questions, createEmptyQuestion()])}
          >
            문항추가
          </Button>
        )}
      </Group>
      <Actions>
        {isEditing && !values.isLocked ? (
          <>
            {savedValues && (
              <Button color="assistive" onClick={handleCancel}>
                취소
              </Button>
            )}
            <Button disabled={!savedValues && !isValid} onClick={requestSave}>
              저장
            </Button>
          </>
        ) : (
          <Button variant="outlined" disabled={values.isLocked} onClick={() => setIsEditing(true)}>
            수정
          </Button>
        )}
      </Actions>
      {isConfirmOpen && (
        <Alert
          heading={LOCK_NOTICE}
          body="문항을 저장할까요?"
          onDimmerClick={() => setIsConfirmOpen(false)}
          actions={[
            { label: '취소', variant: 'assistive', onClick: () => setIsConfirmOpen(false) },
            { label: '저장', variant: 'primary', onClick: handleSave },
          ]}
        />
      )}
    </Wrapper>
  );
};

export default SecondStepQuestionSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 38px 14px;
`;

// Figma: 선택된 파트 칩은 주황 배경에 SemiBold (공통 Category 기본값은 검정 배경)
const PartCategory = styled(Category)`
  & > button[aria-selected='true'] {
    background-color: ${Orange.o500};
    font-weight: 600;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  width: 100%;
`;
