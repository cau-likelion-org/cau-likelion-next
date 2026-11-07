import { useState } from 'react';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';

import { RecruitQuestionType } from './mock';

export const QUESTION_TYPE_LABEL: Record<RecruitQuestionType, string> = {
  LONG_TEXT: '장문 텍스트',
  LINK: '링크',
  FILE: '파일',
  SINGLE_CHOICE: '객관식 단일',
  MULTIPLE_CHOICE: '객관식 복수',
};

const TYPES = Object.keys(QUESTION_TYPE_LABEL) as RecruitQuestionType[];
const LABELS = TYPES.map((type) => QUESTION_TYPE_LABEL[type]);

export interface QuestionTypeSelectProps {
  value: RecruitQuestionType | null;
  onChange: (type: RecruitQuestionType) => void;
  readOnly?: boolean;
}

const QuestionTypeSelect = ({ value, onChange, readOnly = false }: QuestionTypeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = value ? QUESTION_TYPE_LABEL[value] : '';
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options: LABELS,
    value: label,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: (selected) => onChange(TYPES[LABELS.indexOf(selected)]),
  });

  return (
    <div ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        heading="문항 유형"
        aria-label="문항 유형"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        placeholder="선택해주세요."
        value={label}
        readOnly={readOnly}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen && (
          <ListboxOptions
            listId={listId}
            options={LABELS}
            value={label}
            activeIndex={activeIndex}
            onSelect={selectOption}
          />
        )}
      </Select>
    </div>
  );
};

export default QuestionTypeSelect;
