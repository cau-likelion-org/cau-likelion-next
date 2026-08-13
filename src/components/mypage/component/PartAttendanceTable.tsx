import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import {
  AttendanceStatus,
  AttendanceStatusResponse,
  AttendanceStatusUpdate,
  MemberAttendanceResponse,
} from 'src/apis/attendance';
import AttendanceReasonModal from '@mypage/component/AttendanceReasonModal';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { IcCaretDown, IcCaretUp } from '@assets/svg';
import { BackgroundColor, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 컴팩트 caret 드롭다운 (헤더 파트 필터용). useListboxSelect + ListboxOptions 재사용.
const CaretSelect = ({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: onChange,
  });

  return (
    <CaretWrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <CaretTrigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <CaretValue>{value}</CaretValue>
        <IcCaretDown width={16} height={16} />
      </CaretTrigger>
      {isOpen && (
        <ListboxOptions
          listId={listId}
          options={options}
          value={value}
          activeIndex={activeIndex}
          onSelect={selectOption}
        />
      )}
    </CaretWrapper>
  );
};

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  BEFORE: '출석 전',
  PRESENT: '출석',
  LATE: '지각',
  ABSENT: '결석',
  UNAUTHORIZED_ABSENT: '무단결석',
  EXCUSED: '공결',
};
// 수정 시 선택 가능한 상태 (Figma 순서). '출석 전'(BEFORE)은 되돌릴 수 없어 제외.
const EDIT_STATUS_OPTIONS: AttendanceStatus[] = ['PRESENT', 'LATE', 'ABSENT', 'EXCUSED', 'UNAUTHORIZED_ABSENT'];

// 수정 모드 출결 셀 드롭다운. 표가 가로 스크롤로 클리핑되므로 메뉴는 portal로 body에 띄운다.
const StatusDropdown = ({
  value,
  ariaLabel,
  onChange,
}: {
  value: AttendanceStatus;
  ariaLabel: string;
  onChange: (status: AttendanceStatus) => void;
}) => {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const open = () => {
    // 메뉴는 셀 박스(오렌지 테두리) 왼쪽에 정렬 (Figma)
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (rect) setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setActiveIndex(Math.max(EDIT_STATUS_OPTIONS.indexOf(value), 0));
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

  const select = (status: AttendanceStatus) => {
    onChange(status);
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
        setActiveIndex((prev) => Math.min(prev + 1, EDIT_STATUS_OPTIONS.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(EDIT_STATUS_OPTIONS[activeIndex]);
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
    <StatusWrapper ref={wrapperRef} $open={isOpen}>
      <StatusTrigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls={listId}
        $open={isOpen}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
      >
        <span>{STATUS_LABEL[value]}</span>
        {isOpen ? <IcCaretUp width={16} height={16} /> : <IcCaretDown width={16} height={16} />}
      </StatusTrigger>
      {isOpen &&
        position &&
        createPortal(
          <StatusMenu
            ref={menuRef}
            id={listId}
            role="listbox"
            style={{ top: position.top, left: position.left, minWidth: Math.max(position.width, 96) }}
          >
            {EDIT_STATUS_OPTIONS.map((status, index) => (
              <StatusOption
                key={status}
                type="button"
                role="option"
                aria-selected={status === value}
                $active={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(status)}
              >
                {STATUS_LABEL[status]}
              </StatusOption>
            ))}
          </StatusMenu>,
          document.body,
        )}
    </StatusWrapper>
  );
};

interface PartFilterConfig {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface PartAttendanceTableProps {
  members: MemberAttendanceResponse[];
  partName?: string; // 운영진: 본인 파트 고정 라벨
  partFilter?: PartFilterConfig; // 회장/관리자: 파트 필터 드롭다운
  onSave?: (updates: AttendanceStatusUpdate[]) => void; // 수정 저장 (batch)
  isSaving?: boolean;
}

// 결석·공결은 사유(reason)가 필수 → 선택 시 사유 모달을 띄운다.
const REASON_REQUIRED: AttendanceStatus[] = ['ABSENT', 'EXCUSED'];

interface EditValue {
  status: AttendanceStatus;
  reason?: string;
}

const PartAttendanceTable = ({ members, partName, partFilter, onSave, isSaving }: PartAttendanceTableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  // 변경된 출결만 detailAttendanceId → {상태, 사유}로 추적
  const [edits, setEdits] = useState<Map<number, EditValue>>(new Map());
  // 사유 입력 대기 중인 셀 (결석·공결 선택 시)
  const [reasonTarget, setReasonTarget] = useState<{
    record: AttendanceStatusResponse;
    status: AttendanceStatus;
  } | null>(null);

  // 최신 주차부터 1주차까지 연속으로 표시 (예: 최신 18주차면 18 → 1)
  const { weeks, recordMaps } = useMemo(() => {
    const maxWeek = members.reduce(
      (max, member) => member.attendances.reduce((acc, a) => Math.max(acc, a.weekNumber), max),
      0,
    );
    return {
      weeks: Array.from({ length: maxWeek }, (_, index) => maxWeek - index),
      recordMaps: members.map((member) => new Map(member.attendances.map((a) => [a.weekNumber, a]))),
    };
  }, [members]);

  const startEdit = () => {
    setEdits(new Map());
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEdits(new Map());
    setIsEditing(false);
  };

  const changeStatus = (record: AttendanceStatusResponse, status: AttendanceStatus) => {
    // 결석·공결은 사유 입력 후 확정
    if (REASON_REQUIRED.includes(status)) {
      setReasonTarget({ record, status });
      return;
    }
    setEdits((prev) => {
      const next = new Map(prev);
      if (status === record.status) next.delete(record.detailAttendanceId);
      else next.set(record.detailAttendanceId, { status });
      return next;
    });
  };

  const commitReason = (reason: string) => {
    if (!reasonTarget) return;
    const { record, status } = reasonTarget;
    setEdits((prev) => {
      const next = new Map(prev);
      next.set(record.detailAttendanceId, { status, reason });
      return next;
    });
    setReasonTarget(null);
  };

  const handleSave = () => {
    const updates: AttendanceStatusUpdate[] = Array.from(edits, ([detailAttendanceId, { status, reason }]) => ({
      detailAttendanceId,
      status,
      ...(reason ? { reason } : {}),
    }));
    onSave?.(updates);
    setIsEditing(false);
  };

  return (
    <Wrapper>
      <Header>
        <TitleRow>
          <Title>주차별 출결 현황</Title>
          {partFilter ? (
            <CaretSelect
              ariaLabel="파트 선택"
              value={partFilter.value}
              options={partFilter.options}
              onChange={partFilter.onChange}
            />
          ) : (
            partName && <PartName>{partName} 파트</PartName>
          )}
        </TitleRow>
        {onSave &&
          (isEditing ? (
            <ButtonGroup>
              <EditButton type="button" onClick={cancelEdit} disabled={isSaving}>
                취소
              </EditButton>
              <SaveButton type="button" onClick={handleSave} disabled={isSaving}>
                저장
              </SaveButton>
            </ButtonGroup>
          ) : (
            <EditButton type="button" onClick={startEdit}>
              수정
            </EditButton>
          ))}
      </Header>

      <TableRow>
        <FixedColumn>
          <HeadCell>아기사자</HeadCell>
          {members.map((member) => (
            <ValueCell key={member.memberId}>{member.memberName}</ValueCell>
          ))}
        </FixedColumn>

        <WeeksScroll>
          <WeeksInner>
            <WeeksGroup>
              {weeks.map((week) => (
                <WeekColumn key={week}>
                  <HeadCell>{week}주차</HeadCell>
                  {members.map((member, index) => {
                    const record = recordMaps[index].get(week);
                    const status = record ? (edits.get(record.detailAttendanceId)?.status ?? record.status) : undefined;
                    return (
                      <StatusCell key={member.memberId}>
                        {isEditing && record && status ? (
                          <StatusDropdown
                            ariaLabel={`${member.memberName} ${week}주차 출결`}
                            value={status}
                            onChange={(next) => changeStatus(record, next)}
                          />
                        ) : (
                          <span>{status ? STATUS_LABEL[status] : '-'}</span>
                        )}
                      </StatusCell>
                    );
                  })}
                </WeekColumn>
              ))}
            </WeeksGroup>

            <PenaltyColumn>
              <PenaltyCard>
                <HeadCell $penalty>감점</HeadCell>
                {members.map((member) => (
                  <ValueCell key={member.memberId} $penalty>
                    {member.attendancePenalty}점
                  </ValueCell>
                ))}
              </PenaltyCard>
            </PenaltyColumn>
          </WeeksInner>
        </WeeksScroll>
      </TableRow>

      {reasonTarget && (
        <AttendanceReasonModal
          initialReason={edits.get(reasonTarget.record.detailAttendanceId)?.reason ?? reasonTarget.record.reason ?? ''}
          onClose={() => setReasonTarget(null)}
          onSave={commitReason}
        />
      )}
    </Wrapper>
  );
};

export default PartAttendanceTable;

const HEAD_HEIGHT = 52;
const ROW_HEIGHT = 70;
const GRID_BORDER = Line.subtle;
const HEADER_BG = '#F5F7F9';
const CELL_BG = '#FCFDFD';
const PENALTY_BORDER = '#FFD99D';
const PENALTY_HEADER_BG = '#FFEED0';
const PENALTY_CELL_BG = '#FFF8EB';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const PartName = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const CaretWrapper = styled.div`
  position: relative;
  min-width: 120px;
`;

const CaretTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${HEADER_BG};
  color: ${Label.normal};
  cursor: pointer;
  outline: none;
  ${typographyCss(Typography.body2Normal.medium)}
`;

const CaretValue = styled.span`
  white-space: nowrap;
`;

const EditButton = styled.button`
  flex-shrink: 0;
  padding: 7px 14px;
  border: 1px solid ${Line.normal};
  border-radius: 8px;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.label2.regular)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 8px;
`;

const SaveButton = styled.button`
  flex-shrink: 0;
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  background-color: ${Orange.o500};
  color: #ffffff;
  cursor: pointer;
  ${typographyCss(Typography.label2.bold)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 열린 셀은 칸 박스 전체에 오렌지 테두리 (Figma). 투명 테두리를 항상 잡아 레이아웃 밀림 방지.
const StatusWrapper = styled.div<{ $open: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - 8px);
  height: calc(100% - 14px);
  border: 1.5px solid ${(props) => (props.$open ? Orange.o500 : 'transparent')};
  border-radius: 8px;
`;

const StatusTrigger = styled.div<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  /* 클릭한 셀만 회색 pill로 강조 (Figma) */
  background-color: ${(props) => (props.$open ? Fill.normal : 'transparent')};
  color: ${Label.normal};
  cursor: pointer;
  outline: none;
  ${typographyCss(Typography.headline2.medium)}

  svg {
    color: ${Label.alternative};
  }
`;

const StatusMenu = styled.div`
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 8px;
  border: 1px solid ${Line.neutral};
  border-radius: 16px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 2px 4px -2px rgba(23, 23, 23, 0.06),
    0px 4px 6px -1px rgba(23, 23, 23, 0.06);
`;

const StatusOption = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  background-color: ${(props) => (props.$active ? 'rgba(23, 23, 23, 0.04)' : 'transparent')};
  text-align: left;
  white-space: nowrap;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.regular)}
`;

const TableRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 20px;
  width: 100%;
`;

const FixedColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 160px;
  border: 1px solid ${GRID_BORDER};
  border-radius: 14px;
  overflow: hidden;
`;

const WeeksScroll = styled.div`
  flex: 1 0 0;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: thin;
`;

const WeeksInner = styled.div`
  display: flex;
  align-items: stretch;
  width: max-content;
`;

const WeeksGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  border: 1px solid ${GRID_BORDER};
  border-radius: 14px;
  overflow: hidden;
`;

const WeekColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 120px;

  & + & {
    border-left: 1px solid ${GRID_BORDER};
  }
`;

const PenaltyColumn = styled.div`
  position: sticky;
  right: 0;
  z-index: 1;
  flex-shrink: 0;
  width: 160px;

  /* 주차 열이 감점 밑으로 스크롤될 때 흰색 페이드로 자연스럽게 사라지게 (Figma Rectangle 667) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -40px;
    width: 40px;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), #ffffff);
    pointer-events: none;
  }
`;

const PenaltyCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${PENALTY_BORDER};
  border-radius: 14px;
  overflow: hidden;
`;

const cellBase = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const HeadCell = styled.div<{ $penalty?: boolean }>`
  ${cellBase}
  height: ${HEAD_HEIGHT}px;
  color: #121212;
  background-color: ${(props) => (props.$penalty ? PENALTY_HEADER_BG : HEADER_BG)};
  border-bottom: 1px solid ${(props) => (props.$penalty ? PENALTY_BORDER : GRID_BORDER)};
  ${typographyCss(Typography.heading2.bold)}
`;

const ValueCell = styled.div<{ $penalty?: boolean }>`
  ${cellBase}
  height: ${ROW_HEIGHT}px;
  color: #121212;
  background-color: ${(props) => (props.$penalty ? PENALTY_CELL_BG : CELL_BG)};

  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => (props.$penalty ? PENALTY_BORDER : GRID_BORDER)};
  }

  ${typographyCss(Typography.heading1.bold)}
`;

const StatusCell = styled.div`
  ${cellBase}
  height: ${ROW_HEIGHT}px;
  color: ${Label.strong};
  background-color: ${CELL_BG};

  &:not(:last-child) {
    border-bottom: 1px solid ${GRID_BORDER};
  }

  ${typographyCss(Typography.headline2.medium)}
`;
