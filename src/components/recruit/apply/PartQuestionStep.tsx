import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import styled from 'styled-components';

import Button from '@common/button/Button';
import CharCount from '@common/charCount/CharCount';
import Checkbox from '@common/checkbox/Checkbox';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import Radio from '@common/radio/Radio';
import Textarea from '@common/textarea/Textarea';
import useScrollToFirstError from 'src/hooks/useScrollToFirstError';
import { RecruitQuestion } from '@mypage/recruit/mock';
import { isUnfilled } from '@utils/index';

import ApplyFieldHeading from './ApplyFieldHeading';
import ApplyFileField from './ApplyFileField';
import ApplySubmitDialog from './ApplySubmitDialog';
import { applyFieldHeadingCss } from './applyFieldStyle';
import { isApplyDeadlinePassed, submitApplication, uploadApplyFile } from './mock';
import { REQUIRED_MESSAGE, toFieldStatus } from './validation';

const PORTFOLIO_FILE_TYPE = 'application/pdf';
const PORTFOLIO_FILE_MAX_BYTES = 30 * 1024 * 1024;
const LINK_REGEX = /^https?:\/\/\S+\.\S+$/;

const LINK_ERROR_MESSAGE = '올바른 URL을 입력해주세요';
const UPLOAD_ERROR_MESSAGE = '업로드에 실패했습니다. 다시 시도해주세요';

const getPortfolioFileError = (file: File) => {
  if (file.type !== PORTFOLIO_FILE_TYPE) return 'PDF 파일만 업로드 가능합니다.';
  if (file.size > PORTFOLIO_FILE_MAX_BYTES) return '파일 용량이 초과되었습니다.';
  return undefined;
};

export interface PartQuestionStepProps {
  questions: RecruitQuestion[];
  onPrev: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSubmitted: () => void;
}

const PartQuestionStep = ({ questions, onPrev, onDirtyChange, onSubmitted }: PartQuestionStepProps) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, string[]>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [fileErrors, setFileErrors] = useState<Record<string, string | undefined>>({});
  // [다음]을 누른 뒤부터 비어 있는 필수 문항을 오류로 표시한다
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  // 폼 진입이 마감 전이었다면 마감 후에도 제출할 수 있지만, 지각 제출임을 한 번 더 알린다
  const [isLateSubmit, setIsLateSubmit] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollToFirstError = useScrollToFirstError(rootRef);

  const isDirty =
    Object.values(texts).some((text) => !isUnfilled(text)) ||
    Object.values(choices).some((selected) => selected.length > 0) ||
    Object.keys(files).length > 0;

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const uploadMutation = useMutation({
    mutationFn: ({ file }: { id: string; file: File }) => uploadApplyFile(file),
    onSuccess: (_, { id, file }) => setFiles((prev) => ({ ...prev, [id]: file })),
    onError: (_, { id }) => setFileErrors((prev) => ({ ...prev, [id]: UPLOAD_ERROR_MESSAGE })),
  });

  const submitMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      setIsSubmitConfirmOpen(false);
      onSubmitted();
    },
  });

  const getError = (question: RecruitQuestion, submitted = isSubmitted) => {
    const text = texts[question.id] ?? '';
    if (question.type === 'FILE' && fileErrors[question.id]) return fileErrors[question.id];
    if (!submitted) return undefined;
    if (question.type === 'LINK' && !isUnfilled(text) && !LINK_REGEX.test(text.trim())) return LINK_ERROR_MESSAGE;
    if (!question.isRequired) return undefined;
    const isEmpty =
      question.type === 'FILE'
        ? !files[question.id]
        : question.type === 'SINGLE_CHOICE' || question.type === 'MULTIPLE_CHOICE'
          ? !choices[question.id]?.length
          : isUnfilled(text);
    return isEmpty ? REQUIRED_MESSAGE : undefined;
  };

  const changeText = (id: string, value: string) => setTexts((prev) => ({ ...prev, [id]: value }));

  const selectFile = (id: string, file: File) => {
    const error = getPortfolioFileError(file);
    setFileErrors((prev) => ({ ...prev, [id]: error }));
    if (!error) uploadMutation.mutate({ id, file });
  };

  const removeFile = (id: string) =>
    setFiles((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const toggleChoice = (question: RecruitQuestion, choiceId: string, checked: boolean) =>
    setChoices((prev) => {
      if (question.type === 'SINGLE_CHOICE') return { ...prev, [question.id]: [choiceId] };
      const selected = prev[question.id] ?? [];
      return {
        ...prev,
        [question.id]: checked ? [...selected, choiceId] : selected.filter((id) => id !== choiceId),
      };
    });

  const submit = () => {
    setIsSubmitted(true);
    // 거부·실패한 파일은 저장되지 않으므로, 파일 문항은 필수인데 파일이 없을 때만 제출을 막는다
    const hasError = questions.some((question) =>
      question.type === 'FILE' ? question.isRequired && !files[question.id] : getError(question, true),
    );
    if (hasError) return scrollToFirstError();
    setIsLateSubmit(isApplyDeadlinePassed());
    setIsSubmitConfirmOpen(true);
  };

  return (
    <Root ref={rootRef}>
      <Fields>
        {questions.map((question, index) => {
          const heading = `${index + 1}. ${question.title}`;
          const error = getError(question);
          const text = texts[question.id] ?? '';

          if (question.type === 'LONG_TEXT') {
            return (
              <LongTextarea
                key={question.id}
                heading={heading}
                required={question.isRequired}
                placeholder="내용을 입력해 주세요"
                maxLength={Number(question.maxLength) || undefined}
                value={text}
                status={toFieldStatus(error)}
                description={error ?? (question.description || undefined)}
                bottomTrailingContent={
                  question.maxLength && (
                    <Count>
                      {text.length}/{question.maxLength}
                    </Count>
                  )
                }
                onChange={(event) => changeText(question.id, event.target.value)}
              />
            );
          }

          if (question.type === 'LINK') {
            return (
              <ApplyTextarea
                key={question.id}
                heading={heading}
                required={question.isRequired}
                inputMode="url"
                placeholder="https://"
                value={text}
                status={toFieldStatus(error)}
                description={error ?? (question.description || undefined)}
                onChange={(event) => changeText(question.id, event.target.value.replace(/\n/g, ''))}
              />
            );
          }

          if (question.type === 'FILE') {
            return (
              <ApplyFileField
                key={question.id}
                heading={heading}
                required={question.isRequired}
                placeholder="파일을 선택해 주세요. (PDF 1개, 30MB 이하)"
                accept=".pdf"
                file={files[question.id]}
                loading={uploadMutation.isPending && uploadMutation.variables?.id === question.id}
                description={question.description || undefined}
                error={error}
                onSelect={(file) => selectFile(question.id, file)}
                onRemove={() => removeFile(question.id)}
              />
            );
          }

          const selected = choices[question.id] ?? [];
          const ChoiceControl = question.type === 'SINGLE_CHOICE' ? Radio : Checkbox;
          return (
            <Field key={question.id} aria-invalid={!!error} tabIndex={-1}>
              <ApplyFieldHeading title={heading} required={question.isRequired} />
              <ChoiceList>
                {question.choices.map((choice) => (
                  <ChoiceControl
                    key={choice.id}
                    label={choice.text}
                    checked={selected.includes(choice.id)}
                    onChange={(checked) => toggleChoice(question, choice.id, checked)}
                  />
                ))}
              </ChoiceList>
              {(error ?? question.description) && (
                <FieldDescription $status={toFieldStatus(error)}>{error ?? question.description}</FieldDescription>
              )}
            </Field>
          );
        })}
      </Fields>
      <Actions>
        <Button color="assistive" onClick={onPrev}>
          이전
        </Button>
        <Button onClick={submit}>다음</Button>
      </Actions>
      {isSubmitConfirmOpen && (
        <ApplySubmitDialog
          isLate={isLateSubmit}
          loading={submitMutation.isPending}
          onCancel={() => setIsSubmitConfirmOpen(false)}
          onConfirm={() => submitMutation.mutate()}
        />
      )}
    </Root>
  );
};

export default PartQuestionStep;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 78px;
  width: 100%;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
  width: 100%;
`;

// Figma의 링크 입력칸은 한 줄짜리 Textarea(높이 50px)로 그려져 있어 그대로 맞춘다
const ApplyTextarea = styled(Textarea)`
  ${applyFieldHeadingCss}
`;

// 장문 입력칸 높이 200px = 입력 영역 146px + 상하 여백 24px + 간격 12px + 글자 수 줄 18px
const LongTextarea = styled(ApplyTextarea)`
  textarea {
    min-height: 146px;
  }
`;

// Figma 글자 수 표시는 Label 2 Medium
const Count = styled(CharCount)`
  font-weight: 500;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  outline: none;
`;

const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
