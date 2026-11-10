import styled from 'styled-components';

import RecruitResultLayout, { RecruitResultLayoutProps } from '@recruit/RecruitResultLayout';
import { Fill, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface RecruitSummaryRow {
  label: string;
  value: string;
}

export interface RecruitSummaryProps extends Omit<RecruitResultLayoutProps, 'children'> {
  rows: RecruitSummaryRow[];
  notices: string[];
}

const RecruitSummary = ({ rows, notices, ...layoutProps }: RecruitSummaryProps) => (
  <RecruitResultLayout {...layoutProps}>
    <SummaryBox>
      {rows.map(({ label, value }) => (
        <SummaryRow key={label}>
          <SummaryLabel>{label}</SummaryLabel>
          <SummaryValue>{value}</SummaryValue>
        </SummaryRow>
      ))}
    </SummaryBox>
    <NoticeBox>
      <NoticeTitle>결과 발표 안내</NoticeTitle>
      {notices.map((notice) => (
        <NoticeText key={notice}>{notice}</NoticeText>
      ))}
    </NoticeBox>
  </RecruitResultLayout>
);

export default RecruitSummary;

const SummaryBox = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 16px 18px;
  border-radius: 8px;
  background-color: ${Fill.subtle};
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const SummaryLabel = styled.dt`
  flex-shrink: 0;
  width: 72px;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const SummaryValue = styled.dd`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const NoticeBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: 8px;
  /* Figma 값 그대로 (대응하는 색상 토큰 없음), 테두리 두께만큼 박스가 커지는 것까지 Figma와 같다 */
  border: 1px solid #d9d9d9;
`;

const NoticeTitle = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const NoticeText = styled.p`
  margin: 0;
  word-break: keep-all;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.medium)}
`;
