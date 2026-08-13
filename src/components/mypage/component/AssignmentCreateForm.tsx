import { useState } from 'react';
import styled from 'styled-components';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import TextField from '@common/textField/TextField';
import Textarea from '@common/textarea/Textarea';
import CharCount from '@common/charCount/CharCount';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { AssignmentCreateRequest, AssignmentSubmitType } from 'src/apis/assignment';
import { IcCalendar, IcChevronLeft } from '@assets/svg';
import { BackgroundWhite, Label, Line, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TITLE_MAX = 12;
const DETAIL_MAX = 300;

const SUBMIT_OPTIONS = ['파일첨부', '링크첨부'];
const TYPE_TO_LABEL: Record<AssignmentSubmitType, string> = { FILE: '파일첨부', URL: '링크첨부' };
const LABEL_TO_TYPE: Record<string, AssignmentSubmitType> = { 파일첨부: 'FILE', 링크첨부: 'URL' };

interface AssignmentDraft {
  title: string;
  detail: string;
  endDate: string;
  type: AssignmentSubmitType;
}

const emptyDraft = (): AssignmentDraft => ({ title: '', detail: '', endDate: '', type: 'FILE' });

interface AssignmentCreateFormProps {
  partName: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: AssignmentCreateRequest) => void;
}

const AssignmentCreateForm = ({ partName, submitting, onClose, onSubmit }: AssignmentCreateFormProps) => {
  const [week, setWeek] = useState('');
  const [drafts, setDrafts] = useState<AssignmentDraft[]>([emptyDraft()]);

  const updateDraft = (index: number, patch: Partial<AssignmentDraft>) => {
    setDrafts((prev) => prev.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
  };
  const addDraft = () => setDrafts((prev) => [...prev, emptyDraft()]);
  const removeDraft = (index: number) => setDrafts((prev) => prev.filter((_, i) => i !== index));

  const canSubmit =
    week.trim() !== '' && drafts.every((draft) => draft.title.trim() && draft.detail.trim() && draft.endDate);

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;
    onSubmit({
      week: Number(week),
      assignments: drafts.map((draft) => ({
        title: draft.title.trim(),
        detail: draft.detail.trim(),
        endDate: draft.endDate,
        type: draft.type,
      })),
    });
  };

  return (
    <Page>
      <TopBar>
        <CloseButton type="button" onClick={onClose}>
          <IcChevronLeft width={16} height={16} />
          닫기
        </CloseButton>
        <PageTitle>과제 생성하기</PageTitle>
      </TopBar>

      <TopFields>
        <TopField>
          <Select heading="파트 구분" required value={partName} disabled />
        </TopField>
        <TopField>
          <TextField
            heading="주차 구분"
            required
            placeholder="숫자 입력"
            inputMode="numeric"
            value={week}
            onChange={(event) => setWeek(event.target.value.replace(/[^0-9]/g, ''))}
          />
        </TopField>
      </TopFields>

      <Cards>
        {drafts.map((draft, index) => (
          <Card key={index}>
            <Field>
              <FieldHeadingLarge>
                과제 이름<Required $large>*</Required>
              </FieldHeadingLarge>
              <Textarea
                resize="fixed"
                placeholder="메시지를 입력해 주세요."
                maxLength={TITLE_MAX}
                value={draft.title}
                onChange={(event) => updateDraft(index, { title: event.target.value })}
                bottomTrailingContent={
                  <CharCount>
                    {draft.title.length}/{TITLE_MAX}
                  </CharCount>
                }
              />
            </Field>

            <Field>
              <FieldHeadingLarge>
                과제 설명<Required $large>*</Required>
              </FieldHeadingLarge>
              <Textarea
                resize="fixed"
                placeholder="과제에 대한 설명을 작성해주세요."
                maxLength={DETAIL_MAX}
                value={draft.detail}
                onChange={(event) => updateDraft(index, { detail: event.target.value })}
                bottomTrailingContent={
                  <CharCount>
                    {draft.detail.length}/{DETAIL_MAX}
                  </CharCount>
                }
              />
            </Field>

            <CardBottom>
              <BottomLeft>
                <DateField value={draft.endDate} onChange={(value) => updateDraft(index, { endDate: value })} />
                <SubmitTypeSelect value={draft.type} onChange={(type) => updateDraft(index, { type })} />
              </BottomLeft>
              {drafts.length > 1 && <RemoveCardButton onClick={() => removeDraft(index)} />}
            </CardBottom>
          </Card>
        ))}
      </Cards>

      <AddCardButton onClick={addDraft} ariaLabel="과제 추가" />

      <SubmitRow>
        <SubmitButton type="button" disabled={!canSubmit || submitting} onClick={handleSubmit}>
          생성하기
        </SubmitButton>
      </SubmitRow>
    </Page>
  );
};

export default AssignmentCreateForm;

// 제출 형식 드롭다운 (공용 Select + useListboxSelect)
const SubmitTypeSelect = ({
  value,
  onChange,
}: {
  value: AssignmentSubmitType;
  onChange: (type: AssignmentSubmitType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLabel = TYPE_TO_LABEL[value];
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options: SUBMIT_OPTIONS,
    value: currentLabel,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: (label) => onChange(LABEL_TO_TYPE[label]),
  });

  return (
    <SelectColumn ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        heading="제출 형식"
        required
        value={currentLabel}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
      />
      {isOpen && (
        <ListboxOptions
          listId={listId}
          options={SUBMIT_OPTIONS}
          value={currentLabel}
          activeIndex={activeIndex}
          onSelect={selectOption}
        />
      )}
    </SelectColumn>
  );
};

// 마감일: 달력 아이콘 + 네이티브 date input(오버레이) 조합
const DateField = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  return (
    <DateColumn>
      <FieldHeadingSmall>
        마감일<Required>*</Required>
      </FieldHeadingSmall>
      <DateBox>
        <DateIcon>
          <IcCalendar width={22} height={22} />
        </DateIcon>
        <DateText $filled={!!value}>{value ? value.replace(/-/g, '/') : '캘린더 선택'}</DateText>
        <HiddenDateInput
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => event.currentTarget.showPicker?.()}
        />
      </DateBox>
    </DateColumn>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 12px;
`;

const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 14px 8px 10px;
  border: 1px solid ${Line.normal};
  border-radius: 10px;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body2Normal.medium)}
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${Orange.o500};
  ${typographyCss(Typography.title2.bold)}
`;

const TopFields = styled.div`
  display: flex;
  gap: 20px;
`;

const TopField = styled.div`
  width: 160px;
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 32px;
  border: 1px solid ${Line.subtle};
  border-radius: 22px;
  background-color: ${BackgroundWhite.secondary};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const FieldHeadingLarge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

const FieldHeadingSmall = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const Required = styled.span<{ $large?: boolean }>`
  color: ${State.error};
  ${(props) => typographyCss(props.$large ? Typography.title3.bold : Typography.label1Normal.medium)}
`;

const CardBottom = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

const BottomLeft = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
`;

const SelectColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 160px;
`;

const DateColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 236px;
`;

const DateBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 48px;
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

const DateIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.alternative};
`;

const DateText = styled.span<{ $filled: boolean }>`
  flex: 1 0 0;
  min-width: 0;
  padding: 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.$filled ? Label.normal : Label.assistive)};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const HiddenDateInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  cursor: pointer;
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  min-width: 360px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  background-color: ${Orange.o500};
  color: #ffffff;
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    background-color: #f4f4f5;
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;
