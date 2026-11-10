import styled from 'styled-components';

import InfoList, { InfoListRow } from '@recruit/InfoList';
import RecruitResultLayout, { RecruitResultLayoutProps } from '@recruit/RecruitResultLayout';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface RecruitSummaryProps extends Omit<RecruitResultLayoutProps, 'children'> {
  rows: InfoListRow[];
  notices: string[];
}

const RecruitSummary = ({ rows, notices, ...layoutProps }: RecruitSummaryProps) => (
  <RecruitResultLayout {...layoutProps}>
    <InfoList rows={rows} />
    <NoticeBox>
      <NoticeTitle>결과 발표 안내</NoticeTitle>
      {notices.map((notice) => (
        <NoticeText key={notice}>{notice}</NoticeText>
      ))}
    </NoticeBox>
  </RecruitResultLayout>
);

export default RecruitSummary;

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
