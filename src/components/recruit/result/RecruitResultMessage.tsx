import styled from 'styled-components';

import { toDateTimeLabel } from '@utils/index';
import { Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitResult } from './mock';

export interface RecruitResultMessageProps {
  generation: number;
  result: RecruitResult;
}

const getMessage = (generation: number, result: RecruitResult) => {
  const club = `멋쟁이사자처럼 중앙대학교 ${generation}기`;

  if ('interviewAt' in result) {
    return (
      <>
        {`${result.name}님, 안녕하세요.\n${club} 서류 전형에 `}
        <Highlight>합격</Highlight>
        {`하셨음을 알려드립니다.\n\n면접 일시 : ${toDateTimeLabel(new Date(result.interviewAt))}\n면접 대기 장소 : ${result.interviewPlace}\n\n면접 20분 전까지 대기 장소에 도착해 주세요.\n면접에서 뵙겠습니다.`}
      </>
    );
  }
  if (result.stage === 'DOCUMENT') {
    return `${result.name}님, 안녕하세요.\n${club}에 관심을 가지고 지원해 주셔서 감사합니다.\n\n아쉽게도 이번 서류 전형에서는 함께하지 못하게 되었습니다.\n보내주신 관심에 다시 한번 감사드립니다.`;
  }
  if (result.isPassed) {
    return (
      <>
        {`${result.name}님, 축하드립니다.\n${club} 아기사자로 `}
        <Highlight>최종 합격</Highlight>
        {`하셨습니다.\n\n오리엔테이션 일정은 추후 개별 안내드릴 예정입니다.\n앞으로 함께할 1년을 기대하겠습니다.`}
      </>
    );
  }
  return `${result.name}님, 안녕하세요.\n${club} 면접에 참여해 주셔서 감사합니다.\n\n아쉽게도 이번에는 함께하지 못하게 되었습니다.\n보내주신 관심과 시간에 다시 한번 감사드립니다.`;
};

const RecruitResultMessage = ({ generation, result }: RecruitResultMessageProps) => (
  <Box>
    <Message>{getMessage(generation, result)}</Message>
  </Box>
);

export default RecruitResultMessage;

const Box = styled.div`
  padding: 24px 18px;
  border: 4px solid ${Orange.o100};
  border-radius: 16px;
  background-color: ${Orange.o50};
`;

const Message = styled.p`
  margin: 0;
  white-space: pre-line;
  word-break: keep-all;
  text-align: center;
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Highlight = styled.strong`
  color: ${Orange.o500};
  font-weight: 600;
`;
