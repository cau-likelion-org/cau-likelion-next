import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
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
import { isUnfilled } from '@utils/index';
import { IcCalendar, IcChevronLeft, IcCircleExclamation } from '@assets/svg';
import { BackgroundWhite, Fill, Label, Line, Material, Orange, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss } from '@utils/constant/breakpoint';

// 한글이 하나라도 섞이면 16자, 순수 영문·숫자면 20자 (모두 공백 포함) — 프로젝트 서비스명과 동일한 규칙
const TITLE_MAX_KO = 16;
const TITLE_MAX_EN = 20;
const HANGUL_REGEX = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
const getTitleMax = (value: string) => (HANGUL_REGEX.test(value) ? TITLE_MAX_KO : TITLE_MAX_EN);
const DETAIL_MAX = 300;

const SUBMIT_OPTIONS = ['파일첨부', '링크첨부'];
const TYPE_TO_LABEL: Record<AssignmentSubmitType, string> = { FILE: '파일첨부', URL: '링크첨부' };
const LABEL_TO_TYPE: Record<string, AssignmentSubmitType> = { 파일첨부: 'FILE', 링크첨부: 'URL' };

export interface AssignmentDraft {
  assignmentId?: number; // 수정 모드에서 기존 과제 식별 (없으면 새로 추가한 과제)
  title: string;
  detail: string;
  endDate: string;
  type: AssignmentSubmitType;
}

const emptyDraft = (): AssignmentDraft => ({ title: '', detail: '', endDate: '', type: 'FILE' });

interface AssignmentCreateFormProps {
  partName: string;
  mode?: 'create' | 'edit';
  initialWeek?: number; // 수정 모드: 주차 고정 (API상 주차는 변경 불가)
  initialDrafts?: AssignmentDraft[];
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (week: number, drafts: AssignmentDraft[]) => void;
  onDeleteAssignment?: (assignmentId: number) => void; // 수정 모드: 기존 과제 삭제
}

const AssignmentCreateForm = ({
  partName,
  mode = 'create',
  initialWeek,
  initialDrafts,
  submitting,
  onClose,
  onSubmit,
  onDeleteAssignment,
}: AssignmentCreateFormProps) => {
  const isEdit = mode === 'edit';
  const router = useRouter();
  const [week, setWeek] = useState(initialWeek != null ? String(initialWeek) : '');
  const [drafts, setDrafts] = useState<AssignmentDraft[]>(initialDrafts ?? [emptyDraft()]);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  // 제출 시도 후에만 필수항목 에러 표시 (프로젝트 추가 admin 페이지와 동일)
  const [showErrors, setShowErrors] = useState(false);
  // 저장 전 이탈 방지 모달
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const bypassGuardRef = useRef(false); // 제출 성공/이탈 확인 시 가드 우회
  const pendingUrlRef = useRef<string | null>(null); // 라우트 변경으로 막힌 목적지

  const updateDraft = (index: number, patch: Partial<AssignmentDraft>) => {
    setDrafts((prev) => prev.map((draft, i) => (i === index ? { ...draft, ...patch } : draft)));
  };
  const addDraft = () => setDrafts((prev) => [...prev, emptyDraft()]);
  const removeDraft = (index: number) => setDrafts((prev) => prev.filter((_, i) => i !== index));

  // 영문만 있을 땐 20자지만 한글이 섞이는 순간 한도가 16자로 줄어든다. 한도를 넘기는 입력은 막되,
  // 이미 입력된 글자를 잘라내지는 않는다(지우는 방향은 항상 허용).
  const handleTitleChange = (index: number, next: string) => {
    const prev = drafts[index].title;
    if (next.length > prev.length && next.length > getTitleMax(next)) return;
    updateDraft(index, { title: next });
  };

  const canSubmit =
    !isUnfilled(week) &&
    drafts.every(
      (draft) =>
        !isUnfilled(draft.title) &&
        draft.title.length <= getTitleMax(draft.title) &&
        !isUnfilled(draft.detail) &&
        draft.endDate,
    );

  // 이탈 시 경고: 생성은 입력한 내용이 있으면, 수정은 처음 값에서 바뀌었으면
  const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(initialDrafts ?? []));
  const isDirty = isEdit
    ? JSON.stringify(drafts) !== initialSnapshot
    : !isUnfilled(week) || drafts.some((draft) => draft.title || draft.detail || draft.endDate);

  // 사이드바/뒤로가기 등 라우트 변경 가로채기
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (bypassGuardRef.current || !isDirty) return;
      pendingUrlRef.current = url;
      setShowLeaveConfirm(true);
      router.events.emit('routeChangeError');
      throw '과제 생성 이탈 취소 (저장되지 않은 작업)';
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  }, [isDirty, router.events]);

  // 새로고침/탭 닫기
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || bypassGuardRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleClose = () => {
    if (isDirty) {
      pendingUrlRef.current = null;
      setShowLeaveConfirm(true);
    } else {
      onClose();
    }
  };

  const confirmLeave = () => {
    bypassGuardRef.current = true;
    setShowLeaveConfirm(false);
    const url = pendingUrlRef.current;
    if (url) router.push(url);
    else onClose();
  };

  const cancelLeave = () => {
    pendingUrlRef.current = null;
    setShowLeaveConfirm(false);
  };

  const handleSubmit = () => {
    if (submitting) return;
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }
    bypassGuardRef.current = true;
    onSubmit(
      Number(week),
      drafts.map((draft) => ({ ...draft, title: draft.title.trim(), detail: draft.detail.trim() })),
    );
  };

  // 수정 모드: 기존 과제는 확인 후 API 삭제, 새로 추가한 카드는 그냥 제거
  const handleRemoveCard = (index: number) => {
    const target = drafts[index];
    if (isEdit && target.assignmentId != null) {
      setDeleteTarget(target.assignmentId);
      return;
    }
    removeDraft(index);
  };

  const confirmDelete = () => {
    if (deleteTarget == null) return;
    const next = drafts.filter((draft) => draft.assignmentId !== deleteTarget);
    setDrafts(next);
    setInitialSnapshot(JSON.stringify(next)); // 삭제는 이미 저장된 변경이므로 이탈 경고 대상이 아님
    onDeleteAssignment?.(deleteTarget);
    setDeleteTarget(null);
  };

  return (
    <Page>
      <TopBar>
        <CloseButton type="button" onClick={handleClose}>
          <IcChevronLeft width={16} height={16} />
          닫기
        </CloseButton>
        <PageTitle>{isEdit ? '과제 수정하기' : '과제 생성하기'}</PageTitle>
      </TopBar>

      <TopFields>
        <TopField>
          <StaticField>
            <FieldHeadingSmall>
              파트 구분<Required>*</Required>
            </FieldHeadingSmall>
            <ReadonlyBox>{partName}</ReadonlyBox>
          </StaticField>
        </TopField>
        <TopField>
          {isEdit ? (
            <StaticField>
              <FieldHeadingSmall>
                주차 구분<Required>*</Required>
              </FieldHeadingSmall>
              <ReadonlyBox>{week}</ReadonlyBox>
            </StaticField>
          ) : (
            <TextField
              heading="주차 구분"
              required
              placeholder="숫자 입력"
              inputMode="numeric"
              value={week}
              onChange={(event) => setWeek(event.target.value.replace(/[^0-9]/g, ''))}
              status={showErrors && isUnfilled(week) ? 'negative' : 'normal'}
              description={showErrors && isUnfilled(week) ? '주차를 입력해 주세요.' : undefined}
            />
          )}
        </TopField>
      </TopFields>

      <Cards>
        {drafts.map((draft, index) => (
          <Card key={index}>
            <Field>
              <FieldHeadingLarge>
                과제 이름<Required $large>*</Required>
              </FieldHeadingLarge>
              <CompactTextarea
                resize="fixed"
                placeholder={`텍스트 입력(국문 포함 ${TITLE_MAX_KO}자/영문 ${TITLE_MAX_EN}자)`}
                maxLength={getTitleMax(draft.title)}
                value={draft.title}
                onChange={(event) => handleTitleChange(index, event.target.value)}
                status={
                  showErrors && (isUnfilled(draft.title) || draft.title.length > getTitleMax(draft.title))
                    ? 'negative'
                    : 'normal'
                }
                description={
                  showErrors && isUnfilled(draft.title)
                    ? '과제 이름을 입력해 주세요.'
                    : showErrors && draft.title.length > getTitleMax(draft.title)
                      ? `${getTitleMax(draft.title)}자 이내로 입력해 주세요.`
                      : undefined
                }
                bottomTrailingContent={<CharCount>{draft.title.length}</CharCount>}
              />
            </Field>

            <Field>
              <FieldHeadingLarge>
                과제 설명<Required $large>*</Required>
              </FieldHeadingLarge>
              <CompactTextarea
                resize="fixed"
                placeholder="과제에 대한 설명을 작성해주세요."
                maxLength={DETAIL_MAX}
                value={draft.detail}
                onChange={(event) => updateDraft(index, { detail: event.target.value })}
                status={showErrors && isUnfilled(draft.detail) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(draft.detail) ? '과제 설명을 입력해 주세요.' : undefined}
                bottomTrailingContent={
                  <CharCount>
                    {draft.detail.length}/{DETAIL_MAX}
                  </CharCount>
                }
              />
            </Field>

            <CardBottom>
              <BottomLeft>
                <DateField
                  value={draft.endDate}
                  onChange={(value) => updateDraft(index, { endDate: value })}
                  invalid={showErrors && !draft.endDate}
                />
                <SubmitTypeSelect value={draft.type} onChange={(type) => updateDraft(index, { type })} />
              </BottomLeft>
              {(isEdit || drafts.length > 1) && <RemoveCardButton onClick={() => handleRemoveCard(index)} />}
            </CardBottom>
          </Card>
        ))}
      </Cards>

      <AddCardButton onClick={addDraft} ariaLabel="과제 추가" />

      <SubmitRow>
        <SubmitButton type="button" disabled={submitting} onClick={handleSubmit}>
          {isEdit ? '저장하기' : '생성하기'}
        </SubmitButton>
      </SubmitRow>

      {showLeaveConfirm && (
        <LeaveOverlay role="dialog" aria-modal="true">
          <LeaveDimmer onClick={cancelLeave} />
          <LeaveModal>
            <LeaveInfo>
              <LeaveMessage>
                {isEdit ? '수정 완료 전 이탈 시' : '과제 생성 전 이탈 시'}
                <br />
                작업 내용이 저장되지 않습니다.
              </LeaveMessage>
            </LeaveInfo>
            <LeaveActions>
              <LeaveButton type="button" onClick={cancelLeave}>
                취소
              </LeaveButton>
              <LeaveButton type="button" $primary onClick={confirmLeave}>
                확인
              </LeaveButton>
            </LeaveActions>
          </LeaveModal>
        </LeaveOverlay>
      )}

      {deleteTarget != null && (
        <LeaveOverlay role="dialog" aria-modal="true">
          <LeaveDimmer onClick={() => setDeleteTarget(null)} />
          <LeaveModal>
            <LeaveInfo>
              <LeaveMessage>과제를 정말 삭제하시겠습니까?</LeaveMessage>
            </LeaveInfo>
            <LeaveActions>
              <LeaveButton type="button" onClick={() => setDeleteTarget(null)}>
                취소
              </LeaveButton>
              <LeaveButton type="button" $primary onClick={confirmDelete}>
                삭제
              </LeaveButton>
            </LeaveActions>
          </LeaveModal>
        </LeaveOverlay>
      )}
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
const DateField = ({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) => {
  return (
    <DateColumn>
      <FieldHeadingSmall>
        마감일<Required>*</Required>
      </FieldHeadingSmall>
      <DateBox $invalid={!!invalid}>
        <DateIcon>
          <IcCalendar width={22} height={22} />
        </DateIcon>
        <DateText $filled={!!value}>{value ? value.replace(/-/g, '/') : '캘린더 선택'}</DateText>
        {invalid && (
          <ErrorIcon>
            <IcCircleExclamation width={22} height={22} />
          </ErrorIcon>
        )}
        <HiddenDateInput
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => event.currentTarget.showPicker?.()}
        />
      </DateBox>
      {invalid && <DateError>마감일을 선택해 주세요.</DateError>}
    </DateColumn>
  );
};

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${containerCss}
  padding-top: 40px;
  padding-bottom: 80px;
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

const StaticField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

// 파트 구분: 자동 지정된 읽기전용 값 (Figma: Fill.subtle 배경 + Label.alternative 글씨)
const ReadonlyBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 24px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${Fill.subtle};
  box-shadow:
    inset 0 0 0 1px ${Line.subtle},
    0 1px 2px rgba(0, 0, 0, 0.03);
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
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

// 공용 Textarea의 min-height(78px)가 디자인보다 커서 입력 박스를 컴팩트하게 축소 (Figma 입력 박스 ≈ 80px)
const CompactTextarea = styled(Textarea)`
  textarea {
    min-height: 24px;
  }
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 236px;
`;

const DateBox = styled.div<{ $invalid: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: ${(props) =>
    props.$invalid
      ? 'inset 0 0 0 1px rgba(255, 0, 0, 0.28), 0 1px 2px -1px rgba(23, 23, 23, 0.1)'
      : `inset 0 0 0 1px ${Line.normal}, 0 1px 2px -1px rgba(23, 23, 23, 0.1)`};

  &:focus-within {
    box-shadow: inset 0 0 0 2px rgba(71, 172, 255, 0.43);
  }
`;

// 에러 문구가 컬럼 높이를 늘려 마감일/제출형식 한 줄 정렬이 깨지지 않도록 absolute로 띄움
const DateError = styled.p`
  position: absolute;
  top: 100%;
  left: 0;
  margin: 4px 0 0;
  white-space: nowrap;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;

const DateIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${Label.alternative};
`;

const ErrorIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${State.error};
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

// 저장 전 이탈 방지 모달 (Figma Alert/Resource/Dialog)
const LeaveOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
`;

const LeaveDimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;

const LeaveModal = styled.div`
  position: relative;
  width: 100%;
  min-width: 320px;
  max-width: 400px;
  border-radius: 16px;
  background-color: ${BackgroundWhite.primary};
  overflow: hidden;
`;

const LeaveInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px;
`;

const LeaveMessage = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const LeaveActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 0 28px 20px;
`;

const LeaveButton = styled.button<{ $primary?: boolean }>`
  width: 60px;
  padding: 4px 0;
  border: none;
  background: none;
  text-align: center;
  cursor: pointer;
  color: ${(props) => (props.$primary ? Orange.o500 : Label.alternative)};
  ${typographyCss(Typography.body1Normal.bold)}
`;
