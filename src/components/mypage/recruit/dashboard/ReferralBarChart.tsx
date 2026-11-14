import styled from 'styled-components';

import { DashboardCount } from '@utils/recruitDashboard';
import { BackgroundWhite, Black, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 인원이 많은 순서대로 진한 색을 쓰고, 인원이 같으면 같은 색을 쓴다
const BAR_COLORS = [Orange.o500, Orange.o400, Orange.o300, Orange.o200, Orange.o100, Orange.o75];
const DARK_BAR_COUNT = 3;
// "0명"·"20명" 글자가 막대 안에 들어가는 최소 길이
const MIN_BAR_WIDTH = 88;

export interface ReferralBarChartProps {
  // 많은 순으로 정렬된 지원 경로
  referrals: DashboardCount[];
}

const ReferralBarChart = ({ referrals }: ReferralBarChartProps) => {
  const max = Math.max(0, ...referrals.map((item) => item.count));
  const rankedCounts = Array.from(new Set(referrals.map((item) => item.count))).sort((a, b) => b - a);

  if (max === 0) return <Empty>아직 집계된 지원자 데이터가 없습니다.</Empty>;

  return (
    <Rows>
      {referrals.map((item, index) => {
        const rank = Math.min(rankedCounts.indexOf(item.count), BAR_COLORS.length - 1);
        return (
          <Row key={item.label}>
            <Rank>{index + 1}</Rank>
            <Name title={item.label}>{item.label}</Name>
            <Track>
              <Bar
                style={{ width: `max(${MIN_BAR_WIDTH}px, ${(item.count / max) * 100}%)` }}
                $color={item.count === 0 ? BackgroundWhite.tertiary : BAR_COLORS[rank]}
                $isDark={item.count > 0 && rank < DARK_BAR_COUNT}
              >
                {item.count}명
              </Bar>
            </Track>
          </Row>
        );
      })}
    </Rows>
  );
};

export default ReferralBarChart;

const Rows = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 48px;
  color: ${Label.strong};
  ${typographyCss(Typography.heading2.medium)}
`;

const Rank = styled.span`
  flex-shrink: 0;
  width: 32px;
  text-align: center;
`;

const Name = styled.span`
  flex-shrink: 0;
  width: 120px;
  margin-right: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Track = styled.div`
  display: flex;
  flex: 1 0 0;
  height: 100%;
  min-width: 0;
`;

const Bar = styled.div<{ $color: string; $isDark: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  border-radius: 8px;
  background-color: ${(props) => props.$color};
  color: ${(props) => (props.$isDark ? Black.b0 : Label.normal)};
  white-space: nowrap;
  ${(props) => typographyCss(props.$isDark ? Typography.heading2.bold : Typography.heading2.medium)}
`;

const Empty = styled.p`
  margin: 0;
  padding: 22px 0;
  border-radius: 8px;
  background-color: ${BackgroundWhite.tertiary};
  color: ${Label.alternative};
  text-align: center;
  ${typographyCss(Typography.label1Normal.medium)}
`;
