import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Category from '@common/category/Category';
import Textarea from '@common/textarea/Textarea';
import { IcCircleCheck } from '@assets/svg';
import { toDateTimeLabel } from '@utils/index';
import { TEMPLATE_VARIABLES, fillResultTemplate } from '@utils/recruitResult';
import { Inverse, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import ResultSection, { BorderBox } from './ResultSection';
import { InterviewInfo, TemplateKey } from './resultMock';

const TEMPLATE_LABEL: Record<TemplateKey, string> = {
  DOCUMENT_PASS: '서류 합격',
  DOCUMENT_FAIL: '서류 불합격',
  FINAL_PASS: '최종 합격',
  FINAL_FAIL: '최종 불합격',
};

const PREVIEW_EXAMPLE = { name: '홍길동', interviewAt: '2027.03.16(화) 14:00', interviewPlace: '310관 B101호' };

const VARIABLES = [
  { key: 'name', label: TEMPLATE_VARIABLES.name, interviewOnly: false },
  { key: 'interviewAt', label: TEMPLATE_VARIABLES.interviewAt, interviewOnly: true },
  { key: 'interviewPlace', label: TEMPLATE_VARIABLES.interviewPlace, interviewOnly: true },
];

export interface ResultTemplateSectionProps {
  title: string;
  templateKeys: TemplateKey[];
  templates: Record<TemplateKey, string>;
  savedTemplates: TemplateKey[];
  pending: Partial<Record<TemplateKey, string>>;
  previewApplicant?: { name: string; interview?: InterviewInfo };
  saving: boolean;
  onPendingChange: (pending: Partial<Record<TemplateKey, string>>) => void;
  onSave: () => void;
}

const ResultTemplateSection = forwardRef<HTMLElement, ResultTemplateSectionProps>(function ResultTemplateSection(
  { title, templateKeys, templates, savedTemplates, pending, previewApplicant, saving, onPendingChange, onSave },
  ref,
) {
  const [activeKey, setActiveKey] = useState(templateKeys[0]);
  const [cursor, setCursor] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const caretAfterInsertRef = useRef<number | null>(null);

  const text = pending[activeKey] ?? templates[activeKey];
  const canUseInterviewVariables = activeKey === 'DOCUMENT_PASS';
  const isDirty = Object.entries(pending).some(([key, value]) => value !== templates[key as TemplateKey]);
  const hasEmpty = templateKeys.some((key) => !(pending[key] ?? templates[key]).trim());

  const changeText = (value: string) => onPendingChange({ ...pending, [activeKey]: value });

  const insertVariable = (variable: string) => {
    const position = cursor ?? text.length;
    changeText(text.slice(0, position) + variable + text.slice(position));
    setCursor(position + variable.length);
    caretAfterInsertRef.current = position + variable.length;
  };

  useLayoutEffect(() => {
    const caret = caretAfterInsertRef.current;
    if (caret === null || !textareaRef.current) return;
    caretAfterInsertRef.current = null;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(caret, caret);
  }, [text]);

  const previewInterview = previewApplicant?.interview;
  const preview = fillResultTemplate(
    text,
    previewApplicant
      ? {
          name: previewApplicant.name,
          interviewAt: previewInterview?.date
            ? toDateTimeLabel(new Date(`${previewInterview.date}T${previewInterview.time || '00:00'}:00+09:00`))
            : undefined,
          interviewPlace: previewInterview?.place,
        }
      : PREVIEW_EXAMPLE,
  );

  return (
    <ResultSection ref={ref} title={title} saveDisabled={!isDirty || hasEmpty} saving={saving} onSave={onSave}>
      <TemplateTabs
        variant="accent"
        size="large"
        items={templateKeys.map((key) => ({
          key,
          label: TEMPLATE_LABEL[key],
          trailingIcon: savedTemplates.includes(key) ? <IcCircleCheck width={16} height={16} /> : undefined,
        }))}
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key as TemplateKey);
          setCursor(null);
        }}
      />
      <BorderBox>
        <VariableRow>
          <VariableLabel>변수 삽입</VariableLabel>
          <Variables>
            {VARIABLES.map(({ key, label, interviewOnly }) => (
              <Button
                key={key}
                size="small"
                color="assistive"
                disabled={interviewOnly && !canUseInterviewVariables}
                onClick={() => insertVariable(label)}
              >
                {label}
              </Button>
            ))}
          </Variables>
        </VariableRow>
        {!canUseInterviewVariables && <Caption>면접 관련 변수는 서류 합격 안내문에서만 사용할 수 있습니다.</Caption>}
      </BorderBox>
      <TemplateTextarea
        ref={textareaRef}
        heading="안내문 내용"
        aria-label={`${TEMPLATE_LABEL[activeKey]} 안내문 내용`}
        value={text}
        onChange={(event) => {
          changeText(event.target.value);
          setCursor(event.target.selectionStart);
        }}
        onSelect={(event) => setCursor(event.currentTarget.selectionStart)}
      />
      <TemplateTextarea heading="미리보기" aria-label="미리보기" value={preview} disabled />
    </ResultSection>
  );
});

export default ResultTemplateSection;

const TemplateTabs = styled(Category)`
  svg {
    color: ${Label.alternative};
  }

  [aria-selected='true'] svg {
    color: ${Inverse.label};
  }
`;

const VariableRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const VariableLabel = styled.span`
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const Variables = styled.div`
  display: flex;
  gap: 12px;
`;

const Caption = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;

const TemplateTextarea = styled(Textarea)`
  textarea {
    field-sizing: content;
    min-height: 130px;
  }

  textarea:disabled {
    color: ${Label.alternative};
  }
`;
