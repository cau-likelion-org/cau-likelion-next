import { useState } from 'react';
import styled from 'styled-components';

import Tooltip from '@common/tooltip/Tooltip';

import { DashboardCount } from '@utils/recruitDashboard';
import { BackgroundWhite, Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const SIZE = 238.67;
const RADIUS = SIZE / 2;
// 조각 가운데쯤에 이름을 둔다
const LABEL_RADIUS = RADIUS * 0.58;
// 툴팁 화살표 끝과 조각 이름 중심 사이 거리 (Figma)
const TOOLTIP_OFFSET = 21;
// 인원이 많은 순서대로 진한 색을 쓰고, 인원이 같아도 조각이 구분되도록 순위 자리마다 다른 색을 쓴다
const SLICE_COLORS = [Orange.o500, Orange.o300, Orange.o200, Orange.o100, Orange.o75];

const toPoint = (angle: number, radius: number) => ({
  x: RADIUS + radius * Math.sin(angle),
  y: RADIUS - radius * Math.cos(angle),
});

const getSlicePath = (start: number, end: number) => {
  const from = toPoint(start, RADIUS);
  const to = toPoint(end, RADIUS);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M ${RADIUS} ${RADIUS} L ${from.x} ${from.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${to.x} ${to.y} Z`;
};

export interface DistributionPieChartProps {
  label: string;
  // 선택지 순서대로 12시 방향부터 시계 방향으로 그린다
  items: DashboardCount[];
}

const DistributionPieChart = ({ label, items }: DistributionPieChartProps) => {
  const slices = items.filter((item) => item.count > 0);
  const total = slices.reduce((sum, item) => sum + item.count, 0);
  const ranking = [...slices].sort((a, b) => b.count - a.count).map((item) => item.label);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const toAngle = (count: number) => (count / total) * Math.PI * 2;
  const drawn = slices.map((item, index) => {
    const start = toAngle(slices.slice(0, index).reduce((sum, slice) => sum + slice.count, 0));
    const end = start + toAngle(item.count);
    const color = SLICE_COLORS[Math.min(ranking.indexOf(item.label), SLICE_COLORS.length - 1)];
    const labelPoint = slices.length === 1 ? { x: RADIUS, y: RADIUS } : toPoint((start + end) / 2, LABEL_RADIUS);
    return { ...item, start, end, color, labelPoint };
  });
  const hovered = drawn.find((slice) => slice.label === hoveredLabel);

  return (
    <Root>
      <ChartArea>
        {total === 0 ? (
          <Empty>
            아직 집계된 지원자 데이터가
            <br />
            없습니다.
          </Empty>
        ) : (
          <Pie>
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label={`${label} 분포: ${slices.map((item) => `${item.label} ${item.count}명`).join(', ')}`}
            >
              {drawn.map((slice) => {
                const hoverProps = {
                  fill: slice.color,
                  onMouseEnter: () => setHoveredLabel(slice.label),
                  onMouseLeave: () => setHoveredLabel(null),
                };
                return drawn.length === 1 ? (
                  <circle key={slice.label} cx={RADIUS} cy={RADIUS} r={RADIUS} {...hoverProps} />
                ) : (
                  <path key={slice.label} d={getSlicePath(slice.start, slice.end)} {...hoverProps} />
                );
              })}
              {drawn.map((slice) => (
                <SliceLabel
                  key={slice.label}
                  x={slice.labelPoint.x}
                  y={slice.labelPoint.y}
                  fill={slice.color === Orange.o500 ? Black.b0 : Label.strong}
                >
                  {slice.label}
                </SliceLabel>
              ))}
            </svg>
            {hovered && (
              <TooltipAnchor style={{ left: hovered.labelPoint.x, top: hovered.labelPoint.y - TOOLTIP_OFFSET }}>
                <SliceTooltip position="top" align="center" text={`${hovered.count}명`} />
              </TooltipAnchor>
            )}
          </Pie>
        )}
      </ChartArea>
      <Caption>{label}</Caption>
    </Root>
  );
};

export default DistributionPieChart;

const Root = styled.div`
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  min-width: 0;
`;

const ChartArea = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 20px;
`;

const Empty = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${SIZE}px;
  height: ${SIZE}px;
  margin: 0;
  border-radius: 50%;
  background-color: ${BackgroundWhite.tertiary};
  color: ${Label.alternative};
  text-align: center;
  ${typographyCss(Typography.label1Normal.medium)}
`;

const Pie = styled.div`
  position: relative;
  display: flex;
`;

const TooltipAnchor = styled.div`
  position: absolute;
  transform: translate(-50%, -100%);
  pointer-events: none;
`;

const SliceTooltip = styled(Tooltip)`
  width: max-content;
`;

const SliceLabel = styled.text`
  pointer-events: none;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.24px;
  text-anchor: middle;
  dominant-baseline: middle;
`;

export const Caption = styled.p`
  margin: 0;
  color: ${Label.assistive};
  text-align: center;
  ${typographyCss(Typography.headline1.medium)}
`;
