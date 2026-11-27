import { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { toDateString } from '@utils/date';
import { BackgroundWhite, Black, Label, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
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

export const getInterviewSlotKeys = (schedule: InterviewSchedule) => {
  const times = getTimes(schedule.startTime, schedule.endTime, schedule.unitMinutes);
  return getDates(schedule.startDate, schedule.endDate).flatMap(({ key }) => times.map((time) => toSlotKey(key, time)));
};

export interface InterviewTimeGridProps {
  className?: string;
  schedule: InterviewSchedule;
  selectedSlots?: string[];
  // 넘기지 않으면 칸을 선택할 수 없는 미리보기로 표시한다
  onToggleSlot?: (slot: string) => void;
}

interface ScrollThumb {
  widthPercent: number;
  leftPercent: number;
}

const getScrollThumb = ({ scrollLeft, scrollWidth, clientWidth }: HTMLElement): ScrollThumb | null => {
  if (scrollWidth <= clientWidth) return null;
  const widthPercent = (clientWidth / scrollWidth) * 100;
  const progress = scrollLeft / (scrollWidth - clientWidth);
  return { widthPercent, leftPercent: progress * (100 - widthPercent) };
};

const InterviewTimeGrid = ({ className, schedule, selectedSlots = [], onToggleSlot }: InterviewTimeGridProps) => {
  const dates = getDates(schedule.startDate, schedule.endDate);
  const times = getTimes(schedule.startTime, schedule.endTime, schedule.unitMinutes);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [scrollThumb, setScrollThumb] = useState<ScrollThumb | null>(null);
  const hasGrid = dates.length > 0 && times.length > 0;

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const resizeObserver = new ResizeObserver(() => setScrollThumb(getScrollThumb(scrollEl)));
    resizeObserver.observe(scrollEl);
    // 일정이 바뀌어 격자 폭만 달라져도 스크롤 칸 크기는 그대로라 격자도 함께 관찰한다
    if (gridRef.current) resizeObserver.observe(gridRef.current);
    return () => resizeObserver.disconnect();
  }, [hasGrid]);

  if (!hasGrid) return null;

  return (
    <Root className={className}>
      <GridScroll ref={scrollRef} onScroll={(event) => setScrollThumb(getScrollThumb(event.currentTarget))}>
        <Grid ref={gridRef} $columns={dates.length}>
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
                    <SlotLabel $selected={isSelected}>선택</SlotLabel>
                  </SlotButton>
                );
              })}
            </GridRow>
          ))}
        </Grid>
      </GridScroll>
      {scrollThumb && (
        <ScrollTrack aria-hidden>
          <ScrollThumbBar style={{ width: `${scrollThumb.widthPercent}%`, left: `${scrollThumb.leftPercent}%` }} />
        </ScrollTrack>
      )}
    </Root>
  );
};

export default InterviewTimeGrid;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 100%;
`;

const GridScroll = styled.div`
  max-width: 100%;
  overflow-x: auto;

  ${media.xs} {
    border-radius: 18px;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ScrollTrack = styled.div`
  display: none;

  ${media.xs} {
    display: block;
    position: relative;
    height: 8px;
    border-radius: 100px;
    overflow: hidden;
    background-color: ${BackgroundWhite.tertiary};
  }
`;

const ScrollThumbBar = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 100px;
  background-color: ${Orange.o500};
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

  ${media.xs} {
    background-color: ${Black.b30};
  }
`;

const TimeCellBox = styled.div`
  ${cellCss}
  background-color: ${Orange.o50};

  ${media.xs} {
    background-color: ${Black.b30};
  }
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

  ${media.xs} {
    background-color: ${(props) => (props.$selected ? Orange.o100 : Black.b10)};
  }
`;

const SlotLabel = styled.span<{ $selected: boolean }>`
  visibility: ${(props) => (props.$selected ? 'visible' : 'hidden')};

  ${media.xs} {
    visibility: visible;
    color: ${(props) => (props.$selected ? Orange.o500 : Label.assistive)};
    ${(props) => typographyCss(props.$selected ? Typography.label1Normal.bold : Typography.label1Normal.regular)}
  }
`;
