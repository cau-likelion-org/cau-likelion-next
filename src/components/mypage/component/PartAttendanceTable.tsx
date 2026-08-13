import { useMemo } from 'react';
import styled from 'styled-components';

import { AttendanceStatus, MemberAttendanceResponse } from 'src/apis/attendance';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  BEFORE: '출석 전',
  PRESENT: '출석',
  LATE: '지각',
  ABSENT: '결석',
  UNAUTHORIZED_ABSENT: '무단결석',
  EXCUSED: '공결',
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
  onEdit?: () => void;
}

const PartAttendanceTable = ({ members, partName, partFilter, onEdit }: PartAttendanceTableProps) => {
  // 최신 주차부터 1주차까지 연속으로 표시 (예: 최신 18주차면 18 → 1)
  const { weeks, statusMaps } = useMemo(() => {
    const maxWeek = members.reduce(
      (max, member) => member.attendances.reduce((acc, a) => Math.max(acc, a.weekNumber), max),
      0,
    );
    return {
      weeks: Array.from({ length: maxWeek }, (_, index) => maxWeek - index),
      statusMaps: members.map((member) => new Map(member.attendances.map((a) => [a.weekNumber, a.status]))),
    };
  }, [members]);

  return (
    <Wrapper>
      <Header>
        <TitleRow>
          <Title>주차별 출결 현황</Title>
          {partFilter ? (
            <PartSelect
              aria-label="파트 선택"
              value={partFilter.value}
              onChange={(event) => partFilter.onChange(event.target.value)}
            >
              {partFilter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </PartSelect>
          ) : (
            partName && <PartName>{partName} 파트</PartName>
          )}
        </TitleRow>
        {onEdit && (
          <EditButton type="button" onClick={onEdit}>
            수정
          </EditButton>
        )}
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
                    const status = statusMaps[index].get(week);
                    return <StatusCell key={member.memberId}>{status ? STATUS_LABEL[status] : '-'}</StatusCell>;
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

const PartSelect = styled.select`
  appearance: none;
  padding: 6px 32px 6px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${HEADER_BG};
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%23171719' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body2Normal.medium)}
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
