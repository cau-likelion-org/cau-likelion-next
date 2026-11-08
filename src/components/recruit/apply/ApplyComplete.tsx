import { useRouter } from 'next/router';
import styled from 'styled-components';

import Button from '@common/button/Button';
import { toDateTimeLabel } from '@utils/index';
import { Fill, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface ApplyCompleteProps {
  generation: number;
  submittedAt: Date;
  part: string;
}

const ApplyComplete = ({ generation, submittedAt, part }: ApplyCompleteProps) => {
  const router = useRouter();

  const rows = [
    { label: '제출 일시', value: toDateTimeLabel(submittedAt) },
    { label: '지원 파트', value: part },
  ];

  return (
    <Root>
      <TitleGroup>
        <Title>지원서 제출이 완료되었어요!</Title>
        <Subtitle>멋쟁이사자처럼 중앙대학교 {generation}기에 지원해 주셔서 감사합니다.</Subtitle>
      </TitleGroup>
      <Content>
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
          <NoticeText>
            서류 결과와 최종 결과는 지원하기 페이지의 [결과 확인]에서 지원서 작성 시 등록한 이메일과 비밀번호로 로그인해
            확인할 수 있습니다.
          </NoticeText>
          <NoticeText>제출한 지원서는 수정할 수 없습니다.</NoticeText>
        </NoticeBox>
      </Content>
      <Button onClick={() => router.push('/')}>메인 페이지로</Button>
    </Root>
  );
};

export default ApplyComplete;

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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 58px 0 54px;
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
