import { useState } from 'react';
import styled from 'styled-components';

import Tooltip from '@common/tooltip/Tooltip';

import { DashboardCount } from '@utils/recruitDashboard';
import { Fill, Label, Line, Orange } from '@utils/constant/color';

// Figma 그래프 좌표 (824 × 451)
const WIDTH = 824;
const HEIGHT = 451;
const PLOT_LEFT = 116.82;
const PLOT_RIGHT = 823.6;
const GRID_TOP = 56.48;
const GRID_GAP = 64;
const TICK_COUNT = 5;
const BASELINE = GRID_TOP + GRID_GAP * TICK_COUNT;
const Y_LABEL_RIGHT = 101.17;
const X_ROW_LEFT = 117;
const X_ROW_WIDTH = 707;
const X_ROW_PADDING = 8;
const X_ITEM_WIDTH = 58;
const X_LABEL_CENTER_Y = 405;
const BADGE_TOP = 427;
const BADGE_HEIGHT = 24;
const POINT_RADIUS = 6;
// 툴팁 화살표 끝과 점 중심 사이 거리 (Figma)
const TOOLTIP_OFFSET = 15;

const getXCenter = (index: number, count: number) => {
  const start = X_ROW_LEFT + X_ROW_PADDING + X_ITEM_WIDTH / 2;
  if (count <= 1) return start;
  return start + (index * (X_ROW_WIDTH - X_ROW_PADDING * 2 - X_ITEM_WIDTH)) / (count - 1);
};

// 03/02 형태
const toDayLabel = (date: string) => date.slice(5).replace('-', '/');

export interface SubmissionTrendChartProps {
  dailySubmissions: DashboardCount[];
  isEmpty: boolean;
}

const SubmissionTrendChart = ({ dailySubmissions, isEmpty }: SubmissionTrendChartProps) => {
  const max = Math.max(0, ...dailySubmissions.map((item) => item.count));
  // 눈금 5칸에 가장 많은 날이 들어가도록 간격을 정하고, 데이터가 없으면 Figma처럼 5 단위로 둔다
  const step = max === 0 ? 5 : Math.ceil(max / TICK_COUNT);
  const ticks = Array.from({ length: TICK_COUNT }, (_, index) => step * (TICK_COUNT - index));
  const toY = (count: number) => BASELINE - (count / (step * TICK_COUNT)) * (BASELINE - GRID_TOP);
  const points = dailySubmissions.map((item, index) => ({
    x: getXCenter(index, dailySubmissions.length),
    y: toY(item.count),
  }));
  const summary = dailySubmissions.map((item) => `${toDayLabel(item.label)} ${item.count}명`).join(', ');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hovered = !isEmpty && hoveredIndex !== null ? points[hoveredIndex] : undefined;
  const columnWidth = points.length > 1 ? points[1].x - points[0].x : X_ITEM_WIDTH;

  return (
    <Root>
      <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`일자별 서류 제출 인원: ${summary}`}>
        <AxisTitle x={0} y={11}>
          제출 인원 수 (명)
        </AxisTitle>
        {ticks.map((tick, index) => {
          const y = GRID_TOP + GRID_GAP * index;
          return (
            <g key={tick}>
              <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={y} y2={y} stroke={Line.alternative} />
              <AxisLabel x={Y_LABEL_RIGHT} y={y} textAnchor="end">
                {tick}
              </AxisLabel>
            </g>
          );
        })}
        <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={BASELINE} y2={BASELINE} stroke={Line.neutral} strokeWidth={2} />
        {!isEmpty && (
          <>
            <polyline
              points={points.map(({ x, y }) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={Orange.o500}
              strokeWidth={2}
            />
            {hovered && (
              <line
                x1={hovered.x}
                x2={hovered.x}
                y1={hovered.y}
                y2={BASELINE}
                stroke={Orange.o200}
                strokeDasharray="3 3"
              />
            )}
            {points.map(({ x, y }, index) => (
              <circle key={dailySubmissions[index].label} cx={x} cy={y} r={POINT_RADIUS} fill={Orange.o500} />
            ))}
            {points.map(({ x }, index) => (
              <rect
                key={dailySubmissions[index].label}
                x={x - columnWidth / 2}
                y={0}
                width={columnWidth}
                height={BASELINE}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </>
        )}
        <AxisTitle x={42.21} y={X_LABEL_CENTER_Y - 3}>
          제출 일자
        </AxisTitle>
        {dailySubmissions.map((item, index) => {
          const x = getXCenter(index, dailySubmissions.length);
          const badge = index === 0 ? 'start' : index === dailySubmissions.length - 1 ? 'end' : undefined;
          return (
            <g key={item.label}>
              <AxisLabel x={x} y={X_LABEL_CENTER_Y} textAnchor="middle">
                {toDayLabel(item.label)}
              </AxisLabel>
              {badge && (
                <>
                  <rect
                    x={x - X_ITEM_WIDTH / 2}
                    y={BADGE_TOP}
                    width={X_ITEM_WIDTH}
                    height={BADGE_HEIGHT}
                    rx={6}
                    fill={badge === 'start' ? Fill.normal : Orange.o500}
                    fillOpacity={badge === 'start' ? 1 : 0.08}
                  />
                  <BadgeText
                    x={x}
                    y={BADGE_TOP + BADGE_HEIGHT / 2}
                    textAnchor="middle"
                    fill={badge === 'start' ? Label.alternative : Orange.o500}
                  >
                    {badge === 'start' ? '접수 시작' : '접수 마감'}
                  </BadgeText>
                </>
              )}
            </g>
          );
        })}
      </Svg>
      {hovered && hoveredIndex !== null && (
        <TooltipAnchor
          style={{
            left: `${(hovered.x / WIDTH) * 100}%`,
            top: `calc(${(hovered.y / HEIGHT) * 100}% - ${TOOLTIP_OFFSET}px)`,
          }}
        >
          <PointTooltip position="top" align="center" text={`${dailySubmissions[hoveredIndex].count}명`} />
        </TooltipAnchor>
      )}
    </Root>
  );
};

export default SubmissionTrendChart;

const Root = styled.div`
  position: relative;
  width: 100%;
  max-width: ${WIDTH}px;
`;

const TooltipAnchor = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
`;

const PointTooltip = styled(Tooltip)`
  width: max-content;
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  max-width: ${WIDTH}px;
  height: auto;
  overflow: visible;
`;

const AxisTitle = styled.text`
  fill: ${Label.assistive};
  font-size: 15px;
  font-weight: 500;
  dominant-baseline: middle;
`;

const AxisLabel = styled.text`
  fill: ${Label.normal};
  font-size: 18px;
  font-weight: 500;
  dominant-baseline: middle;
`;

const BadgeText = styled.text`
  font-size: 12px;
  font-weight: 500;
  dominant-baseline: middle;
`;
