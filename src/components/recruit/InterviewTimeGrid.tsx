import styled, { css } from 'styled-components';

import { toDateString } from '@utils/index';
import { Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface InterviewSchedule {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  unitMinutes: number;
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const toDateLabel = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}(${DAY_LABELS[date.getDay()]})`;

// 날짜 입력 중 연도가 덜 입력된 값(0002-03-16 등)이 들어와도 격자가 폭주하지 않게 기간을 제한한다
const MAX_GRID_DAYS = 31;
const DAY_MS = 24 * 60 * 60 * 1000;

const getDates = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return [];
  const dates: { key: string; label: string }[] = [];
  const start = new Date(`${startDate}T00:00`);
  const end = new Date(`${endDate}T00:00`);
  if (Math.round((end.getTime() - start.getTime()) / DAY_MS) + 1 > MAX_GRID_DAYS) return [];
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    dates.push({ key: toDateString(date), label: toDateLabel(date) });
  }
  return dates;
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTimeLabel = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const getTimes = (startTime: string, endTime: string, unitMinutes: number) => {
  if (!startTime || !endTime || unitMinutes <= 0) return [];
  const times: string[] = [];
  for (let minutes = toMinutes(startTime); minutes <= toMinutes(endTime); minutes += unitMinutes) {
    times.push(toTimeLabel(minutes));
  }
  return times;
};

export const toSlotKey = (date: string, time: string) => `${date}T${time}`;

export interface InterviewTimeGridProps {
  className?: string;
  schedule: InterviewSchedule;
  selectedSlots?: string[];
  // 넘기지 않으면 칸을 선택할 수 없는 미리보기로 표시한다
  onToggleSlot?: (slot: string) => void;
}

const InterviewTimeGrid = ({ className, schedule, selectedSlots = [], onToggleSlot }: InterviewTimeGridProps) => {
  const dates = getDates(schedule.startDate, schedule.endDate);
  const times = getTimes(schedule.startTime, schedule.endTime, schedule.unitMinutes);

  if (dates.length === 0 || times.length === 0) return null;

  return (
    <GridScroll className={className}>
      <Grid $columns={dates.length}>
        <HeaderCellBox />
        {dates.map(({ key, label }) => (
          <HeaderCellBox key={key}>{label}</HeaderCellBox>
        ))}
        {times.map((time) => (
          <GridRow key={time}>
            <TimeCellBox>{time}</TimeCellBox>
            {dates.map(({ key, label }) => {
              if (!onToggleSlot) return <SlotCellBox key={key} />;
              const slot = toSlotKey(key, time);
              const isSelected = selectedSlots.includes(slot);
              return (
                <SlotButton
                  key={key}
                  type="button"
                  aria-label={`${label} ${time}`}
                  aria-pressed={isSelected}
                  $selected={isSelected}
                  onClick={() => onToggleSlot(slot)}
                >
                  {isSelected && '선택'}
                </SlotButton>
              );
            })}
          </GridRow>
        ))}
      </Grid>
    </GridScroll>
  );
};

export default InterviewTimeGrid;

const GridScroll = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: 100px repeat(${(props) => props.$columns}, 140px);
  width: max-content;
  border-radius: 18px;
  overflow: hidden;
`;

const GridRow = styled.div`
  display: contents;
`;

const cellCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  box-shadow: inset 0 0 0 1px ${Black.b30};
  color: ${Label.normal};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const HeaderCellBox = styled.div`
  ${cellCss}
  background-color: ${Orange.o100};
`;

const TimeCellBox = styled.div`
  ${cellCss}
  background-color: ${Orange.o50};
`;

const SlotCellBox = styled.div`
  ${cellCss}
  background-color: ${Black.b10};
`;

const SlotButton = styled.button<{ $selected: boolean }>`
  ${cellCss}
  padding: 0;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.$selected ? Orange.o500 : Black.b10)};
  color: ${Black.b0};
  ${typographyCss(Typography.body2Normal.bold)}
`;
