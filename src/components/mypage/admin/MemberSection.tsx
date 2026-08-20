import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { Generation, MemberResponse, MemberRole, MemberUpdateRequest } from '@@types/request';
import TextField from '@common/textField/TextField';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import Button from '@common/button/Button';
import Menu from '@common/menu/Menu';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import EditButton from '@mypage/admin/component/EditButton';
import ConfirmDialog from '@mypage/admin/component/ConfirmDialog';
import { IcCaretDown, IcCaretUp, IcSearch } from '@assets/svg';
import { NUMERIC_ONLY_REGEX, ROLE_LABEL } from '@utils/constant';
import { excludeCommonPart, isEmailFormatInvalid } from '@utils/index';
import { Black, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

export const ALL_FILTER = '전체';
const NO_PART_LABEL = '소속 없음';
const ROLE_OPTIONS: MemberRole[] = ['BABY_LION', 'ADULT_LION', 'STAFF', 'PRESIDENT', 'ADMIN'];

export interface MemberEditUpdate {
  id: number;
  form: MemberUpdateRequest;
}

export interface MemberSaveFailure {
  id: number;
  status?: number;
}

// 저장 요청 일부(회원별 update/delete)가 실패했을 때, 실패한 회원 id를 함께 전달하기 위한 에러
export class MemberSaveError extends Error {
  failures: MemberSaveFailure[];

  constructor(failures: MemberSaveFailure[]) {
    super('일부 회원 정보를 저장하지 못했습니다.');
    this.name = 'MemberSaveError';
    this.failures = failures;
  }
}

interface MemberFilterConfig {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface EditValue {
  name?: string;
  email?: string;
  role?: MemberRole;
  partId?: number | null;
  // "마지막 활동 기수"는 API에 별도 수정 필드가 없다. 화면 표시·파트 재탐색용으로만 쓰고,
  // 실제로는 (파트가 기수에 종속되므로) 같은 이름의 파트를 새 기수에서 찾아 partId로 저장한다.
  generationNumber?: string;
}

const isEditEmpty = (edit: EditValue) =>
  edit.name === undefined &&
  edit.email === undefined &&
  edit.role === undefined &&
  edit.partId === undefined &&
  edit.generationNumber === undefined;

// 수정 모드 파트·권한 셀 드롭다운 (Figma: Menu/Menu). 표가 overflow: hidden으로 잘려서 팝업은 portal로 body에 띄운다.
const EditSelect = ({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}) => {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = () => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.bottom + 4, left: rect.left });
    setActiveIndex(Math.max(options.indexOf(value), 0));
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      close();
    };
    const handleReflow = () => close();
    document.addEventListener('mousedown', handlePointer);
    window.addEventListener('scroll', handleReflow, true);
    window.addEventListener('resize', handleReflow);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      window.removeEventListener('scroll', handleReflow, true);
      window.removeEventListener('resize', handleReflow);
    };
  }, [isOpen]);

  const select = (option: string, index: number) => {
    setActiveIndex(index);
    onChange(option);
    close();
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(options[activeIndex], activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  };

  return (
    <EditSelectWrapper ref={wrapperRef}>
      <EditSelectTrigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        $open={isOpen}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
      >
        <span>{value}</span>
        <EditSelectCaret>
          {isOpen ? <IcCaretUp width={16} height={16} /> : <IcCaretDown width={16} height={16} />}
        </EditSelectCaret>
      </EditSelectTrigger>
      {isOpen &&
        position &&
        createPortal(
          <MenuPositioner ref={menuRef} id={listId} style={{ top: position.top, left: position.left }}>
            <Menu
              items={options.map((option, index) => ({
                id: `${listId}-${index}`,
                label: option,
                active: index === activeIndex,
                onClick: () => select(option, index),
              }))}
            />
          </MenuPositioner>,
          document.body,
        )}
    </EditSelectWrapper>
  );
};

interface MemberSectionProps {
  members: MemberResponse[];
  generations: Generation[];
  isLoading?: boolean;
  isError?: boolean;
  nameQuery: string;
  onNameQueryChange: (value: string) => void;
  generationFilter: MemberFilterConfig;
  partFilter: MemberFilterConfig;
  roleFilter: MemberFilterConfig;
  onSave?: (updates: MemberEditUpdate[], deleteIds: number[]) => void | Promise<unknown>;
  isSaving?: boolean;
}

const MemberSection = ({
  members,
  generations,
  isLoading = false,
  isError = false,
  nameQuery,
  onNameQueryChange,
  generationFilter,
  partFilter,
  roleFilter,
  onSave,
  isSaving,
}: MemberSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Map<number, EditValue>>(new Map());
  const [deletions, setDeletions] = useState<Set<number>>(new Set());
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  // 저장 시 실패로 확인된(주로 서버가 새로 잡아낸 중복 이메일) 회원 id
  const [conflictIds, setConflictIds] = useState<Set<number>>(new Set());
  const [saveError, setSaveError] = useState('');

  const startEdit = () => {
    setEdits(new Map());
    setDeletions(new Set());
    setConflictIds(new Set());
    setSaveError('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEdits(new Map());
    setDeletions(new Set());
    setIsEditing(false);
  };

  const confirmDelete = () => {
    if (deleteTargetId === null) return;
    setEdits((prev) => {
      const next = new Map(prev);
      next.delete(deleteTargetId);
      return next;
    });
    setDeletions((prev) => new Set(prev).add(deleteTargetId));
    setDeleteTargetId(null);
  };

  const changeName = (member: MemberResponse, name: string) => {
    setEdits((prev) => {
      const next = new Map(prev);
      const current = { ...(next.get(member.id) ?? {}) };
      if (name === member.name) delete current.name;
      else current.name = name;
      if (isEditEmpty(current)) next.delete(member.id);
      else next.set(member.id, current);
      return next;
    });
  };

  const changeEmail = (member: MemberResponse, email: string) => {
    setEdits((prev) => {
      const next = new Map(prev);
      const current = { ...(next.get(member.id) ?? {}) };
      if (email === member.email) delete current.email;
      else current.email = email;
      if (isEditEmpty(current)) next.delete(member.id);
      else next.set(member.id, current);
      return next;
    });
    setConflictIds((prev) => {
      if (!prev.has(member.id)) return prev;
      const next = new Set(prev);
      next.delete(member.id);
      return next;
    });
  };

  const getEffectiveEmail = (member: MemberResponse) => edits.get(member.id)?.email ?? member.email;

  // 화면에 보이는 목록(현재 필터 범위) 안에서의 중복만 검사한다 — 필터 밖 회원과의 중복은 저장 시 서버 응답으로 잡는다
  const isEmailDuplicate = (member: MemberResponse) => {
    const email = getEffectiveEmail(member).trim().toLowerCase();
    if (!email) return false;
    return members.some((other) => other.id !== member.id && getEffectiveEmail(other).trim().toLowerCase() === email);
  };

  // 기수는 파트에 종속되므로(파트가 바뀌면 기수도 바뀜), 입력한 기수에 실제로 존재하는 파트가 있을 때만
  // 같은 이름의 파트를 그 기수에서 찾아 partId로 반영한다. 값이 아직 유효한 기수가 아니면 파트는 건드리지 않는다.
  const changeGeneration = (member: MemberResponse, rawValue: string, currentPartName: string) => {
    if (!NUMERIC_ONLY_REGEX.test(rawValue)) return;
    const targetGeneration = generations.find((generation) => String(generation.number) === rawValue);
    setEdits((prev) => {
      const next = new Map(prev);
      const current = { ...(next.get(member.id) ?? {}) };
      if (rawValue === String(member.generationNumber ?? '')) delete current.generationNumber;
      else current.generationNumber = rawValue;

      if (targetGeneration) {
        const matchedPart = targetGeneration.parts.find((part) => part.name === currentPartName);
        const resolvedPartId = matchedPart ? matchedPart.id : null;
        if (resolvedPartId === member.partId) delete current.partId;
        else current.partId = resolvedPartId;
      }

      if (isEditEmpty(current)) next.delete(member.id);
      else next.set(member.id, current);
      return next;
    });
  };

  const changeRole = (member: MemberResponse, label: string) => {
    const role = (Object.keys(ROLE_LABEL) as MemberRole[]).find((key) => ROLE_LABEL[key] === label);
    if (!role) return;
    setEdits((prev) => {
      const next = new Map(prev);
      const current = { ...(next.get(member.id) ?? {}) };
      if (role === member.role) delete current.role;
      else current.role = role;
      if (isEditEmpty(current)) next.delete(member.id);
      else next.set(member.id, current);
      return next;
    });
  };

  const changePart = (member: MemberResponse, label: string, parts: { id: number; name: string }[]) => {
    const partId = label === NO_PART_LABEL ? null : (parts.find((part) => part.name === label)?.id ?? null);
    setEdits((prev) => {
      const next = new Map(prev);
      const current = { ...(next.get(member.id) ?? {}) };
      if (partId === member.partId) delete current.partId;
      else current.partId = partId;
      if (isEditEmpty(current)) next.delete(member.id);
      else next.set(member.id, current);
      return next;
    });
  };

  const visibleMembers = members.filter((member) => !deletions.has(member.id));
  const isAnyInvalid = visibleMembers.some(
    (member) => isEmailFormatInvalid(getEffectiveEmail(member)) || isEmailDuplicate(member),
  );

  const handleSave = async () => {
    if (isAnyInvalid) return;
    const updates: MemberEditUpdate[] = Array.from(edits, ([id, edit]) => {
      const member = members.find((item) => item.id === id);
      return {
        id,
        form: {
          name: edit.name ?? member?.name ?? '',
          email: edit.email ?? member?.email ?? '',
          role: edit.role ?? member?.role ?? 'BABY_LION',
          partId: edit.partId !== undefined ? edit.partId : (member?.partId ?? null),
        },
      };
    });
    const deleteIds = Array.from(deletions);
    setConflictIds(new Set());
    setSaveError('');
    try {
      await onSave?.(updates, deleteIds);
      setIsEditing(false);
      setEdits(new Map());
      setDeletions(new Set());
    } catch (error) {
      if (error instanceof MemberSaveError) {
        // 400(형식)은 저장 전 클라이언트 검증으로 이미 걸러지므로, 여기 남는 건 사실상 409(중복)다
        setConflictIds(new Set(error.failures.map((failure) => failure.id)));
        if (error.failures.some((failure) => failure.status !== 400 && failure.status !== 409)) {
          setSaveError('일부 회원 정보를 저장하지 못했습니다. 다시 시도해 주세요.');
        }
      } else {
        setSaveError('회원 정보 저장에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  return (
    <Wrapper>
      <Header>
        <Title>전체 회원 관리</Title>
        {onSave &&
          (isEditing ? (
            <ButtonGroup>
              <Button color="assistive" size="small" onClick={cancelEdit} disabled={isSaving}>
                취소
              </Button>
              <Button size="small" onClick={handleSave} loading={isSaving} disabled={isAnyInvalid}>
                저장
              </Button>
            </ButtonGroup>
          ) : (
            <EditButton onClick={startEdit} />
          ))}
      </Header>

      {isEditing && saveError && <ErrorText>{saveError}</ErrorText>}

      <FilterRow>
        <SearchField
          heading="이름 검색"
          placeholder="텍스트를 입력해 주세요."
          leadingIcon={<IcSearch width={22} height={22} />}
          value={nameQuery}
          onChange={(event) => onNameQueryChange(event.target.value)}
        />
        <ProjectFilterSelect
          heading="기수 구분"
          options={[ALL_FILTER, ...generationFilter.options]}
          value={generationFilter.value}
          onChange={generationFilter.onChange}
        />
        <ProjectFilterSelect
          heading="파트 구분"
          options={[ALL_FILTER, ...partFilter.options]}
          value={partFilter.value}
          onChange={partFilter.onChange}
        />
        <ProjectFilterSelect
          heading="권한 구분"
          options={[ALL_FILTER, ...roleFilter.options]}
          value={roleFilter.value}
          onChange={roleFilter.onChange}
        />
      </FilterRow>

      <HeaderRow $editing={isEditing}>
        <HeadCell>이름</HeadCell>
        <HeadCell>마지막 활동 기수</HeadCell>
        <HeadCell>파트</HeadCell>
        <HeadCell>로그인 이메일</HeadCell>
        <HeadCell>권한</HeadCell>
        {isEditing && <span aria-hidden />}
      </HeaderRow>

      {isLoading ? (
        <StateWrapper>
          <CircularLoading size={32} />
        </StateWrapper>
      ) : isError ? (
        <TableEmptyState variant="error" />
      ) : visibleMembers.length === 0 ? (
        <TableEmptyState message="조건에 맞는 회원이 없습니다." />
      ) : (
        <Body>
          {visibleMembers.map((member, index) => {
            const edit = edits.get(member.id);
            const generationValue = edit?.generationNumber ?? String(member.generationNumber ?? '');
            const effectiveGenerationNumber =
              edit?.generationNumber !== undefined ? Number(edit.generationNumber) : member.generationNumber;
            const generationParts = excludeCommonPart(
              generations.find((g) => g.number === effectiveGenerationNumber)?.parts ?? [],
            );
            const roleValue = ROLE_LABEL[edit?.role ?? member.role];
            const partId = edit?.partId !== undefined ? edit.partId : member.partId;
            const partValue = generationParts.find((part) => part.id === partId)?.name ?? NO_PART_LABEL;
            const emailValue = edit?.email ?? member.email;
            const isEmailFormatInvalidValue = isEmailFormatInvalid(emailValue);
            const isEmailDuplicateValue =
              !isEmailFormatInvalidValue && (isEmailDuplicate(member) || conflictIds.has(member.id));
            const emailErrorText = isEmailFormatInvalidValue
              ? '이메일 형식에 맞지 않습니다.'
              : isEmailDuplicateValue
                ? '이미 등록된 이메일입니다.'
                : undefined;

            return (
              <Row key={member.id} $editing={isEditing} $divider={index !== visibleMembers.length - 1}>
                {isEditing ? (
                  <NameInput
                    value={edit?.name ?? member.name}
                    aria-label={`${member.name} 이름 수정`}
                    onChange={(event) => changeName(member, event.target.value)}
                  />
                ) : (
                  <NameCell>{member.name}</NameCell>
                )}
                {isEditing ? (
                  <CellInput
                    aria-label={`${member.name} 마지막 활동 기수 수정`}
                    value={generationValue}
                    onChange={(event) => changeGeneration(member, event.target.value, partValue)}
                  />
                ) : (
                  <Cell>{member.generationNumber ?? '-'}</Cell>
                )}
                {isEditing ? (
                  <EditSelect
                    value={partValue}
                    options={[NO_PART_LABEL, ...generationParts.map((part) => part.name)]}
                    onChange={(label) => changePart(member, label, generationParts)}
                    ariaLabel={`${member.name} 파트 수정`}
                  />
                ) : (
                  <Cell>{member.partName ?? '-'}</Cell>
                )}
                {isEditing ? (
                  <EmailFieldColumn>
                    <CellInput
                      type="email"
                      value={emailValue}
                      $invalid={isEmailFormatInvalidValue || isEmailDuplicateValue}
                      aria-label={`${member.name} 이메일 수정`}
                      onChange={(event) => changeEmail(member, event.target.value)}
                    />
                    {emailErrorText && <ErrorText>{emailErrorText}</ErrorText>}
                  </EmailFieldColumn>
                ) : (
                  <Cell>{member.email}</Cell>
                )}
                {isEditing ? (
                  <EditSelect
                    value={roleValue}
                    options={ROLE_OPTIONS.map((role) => ROLE_LABEL[role])}
                    onChange={(label) => changeRole(member, label)}
                    ariaLabel={`${member.name} 권한 수정`}
                  />
                ) : (
                  <Cell>{roleValue}</Cell>
                )}
                {isEditing && (
                  <Button
                    variant="outlined"
                    color="assistive"
                    size="small"
                    onClick={() => setDeleteTargetId(member.id)}
                  >
                    삭제
                  </Button>
                )}
              </Row>
            );
          })}
        </Body>
      )}
      {deleteTargetId !== null && (
        <ConfirmDialog
          title="회원을 삭제하시겠습니까?"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </Wrapper>
  );
};

export default MemberSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  padding: 0 14px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  width: 100%;

  ${media.xs} {
    flex-wrap: wrap;
  }
`;

const SearchField = styled(TextField)`
  max-width: 290px;
`;

const GRID = '90px 130px 118px 354px 80px';
const GRID_EDITING = '90px 130px 118px 255px 80px 51px';

const HeaderRow = styled.div<{ $editing: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$editing ? GRID_EDITING : GRID)};
  gap: 20px;
  align-items: center;
  width: 100%;
`;

const HeadCell = styled.span`
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Row = styled.div<{ $editing: boolean; $divider: boolean }>`
  display: grid;
  grid-template-columns: ${(props) => (props.$editing ? GRID_EDITING : GRID)};
  gap: 20px;
  align-items: center;
  width: 100%;
  padding-bottom: 20px;

  ${(props) => props.$divider && `border-bottom: 1px solid ${Line.normal};`}
`;

const NameCell = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const Cell = styled.div`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Label.strong};
  ${typographyCss(Typography.headline2.medium)}
`;

const inputBase = css`
  width: 100%;
  min-width: 0;
  padding: 4px 8px;
  border: none;
  outline: none;
  border-radius: 6px;
  background-color: rgba(23, 23, 23, 0.04);
  color: ${Label.strong};

  &::placeholder {
    color: ${Label.assistive};
  }
`;

const NameInput = styled.input`
  ${inputBase}
  ${typographyCss(Typography.headline1.bold)}
`;

const CellInput = styled.input<{ $invalid?: boolean }>`
  ${inputBase}
  ${typographyCss(Typography.headline2.medium)}

  ${(props) =>
    props.$invalid &&
    css`
      box-shadow: inset 0 0 0 1px rgba(255, 0, 0, 0.28);
    `}
`;

const EmailFieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;

const StateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 240px;
`;

const TableEmptyState = styled(EmptyState)`
  min-height: 240px;
`;

const EditSelectWrapper = styled.div`
  position: relative;
  width: fit-content;
`;

const EditSelectTrigger = styled.div<{ $open: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  color: ${Label.strong};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  ${typographyCss(Typography.headline2.medium)}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -7px;
    right: -7px;
    height: 32px;
    transform: translateY(-50%);
    border-radius: 6px;
    background-color: ${Label.strong};
    opacity: ${(props) => (props.$open ? 0.08 : 0)};
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:hover::before {
    opacity: 0.08;
  }
`;

const EditSelectCaret = styled.span`
  position: relative;
  display: inline-flex;
  color: ${Label.alternative};
`;

const MenuPositioner = styled.div`
  position: fixed;
  z-index: 1000;
`;
