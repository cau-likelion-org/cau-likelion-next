import styled from 'styled-components';

import Button from '@common/button/Button';
import { Fill, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface RecruitSummaryRow {
  label: string;
  value: string;
}

export interface RecruitSummaryProps {
  title: string;
  subtitle: string;
  rows: RecruitSummaryRow[];
  notices: string[];
  actionLabel: string;
  // 안내 박스와 버튼 사이 간격 (Figma 제출 완료 54px, 지원 내역 74px)
  actionGap: number;
  onAction: () => void;
}

// 제출 완료·지원 내역 화면이 함께 쓰는 제출 요약 화면
const RecruitSummary = ({ title, subtitle, rows, notices, actionLabel, actionGap, onAction }: RecruitSummaryProps) => (
  <Root>
    <TitleGroup>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </TitleGroup>
    <Content $actionGap={actionGap}>
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
    </Content>
    <Button onClick={onAction}>{actionLabel}</Button>
  </Root>
);

export default RecruitSummary;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  color: ${Orange.o500};
  text-align: center;
  word-break: keep-all;
`;

const Title = styled.h1`
  margin: 0;
  ${typographyCss(Typography.display2.bold)}
`;

const Subtitle = styled.p`
  margin: 0;
  ${typographyCss(Typography.heading2.medium)}
`;

const Content = styled.div<{ $actionGap: number }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 58px 0 ${(props) => props.$actionGap}px;
`;

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
