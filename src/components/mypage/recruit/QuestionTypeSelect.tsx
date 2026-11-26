import { FieldStatus } from '@common/fieldStatus/FieldStatus';
import ListboxSelect from '@common/select/ListboxSelect';

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
  status?: FieldStatus;
  description?: string;
}

const QuestionTypeSelect = ({ value, onChange, readOnly = false, status, description }: QuestionTypeSelectProps) => (
  <ListboxSelect
    fullWidth
    heading="문항 유형"
    ariaLabel="문항 유형"
    placeholder="선택해주세요."
    options={LABELS}
    value={value ? QUESTION_TYPE_LABEL[value] : ''}
    readOnly={readOnly}
    status={status}
    description={description}
    onChange={(selected) => onChange(TYPES[LABELS.indexOf(selected)])}
  />
);

export default QuestionTypeSelect;
