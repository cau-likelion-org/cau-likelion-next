import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import ApplicantLoginForm from '@recruit/history/ApplicantLoginForm';
import RecruitSummary from '@recruit/RecruitSummary';
import { RECRUIT_MOCK } from '@recruit/mock';
import { toDateTimeLabel } from '@utils/index';

interface SubmittedHistory {
  submittedAt: string;
  part: string;
}

const RecruitHistory = () => {
  const router = useRouter();
  const [history, setHistory] = useState<SubmittedHistory | null>(null);

  if (!history) {
    return (
      <Wrapper>
        <ApplicantLoginForm isApplyOpen={RECRUIT_MOCK.isApplyOpen} onSubmittedHistory={setHistory} />
      </Wrapper>
    );
  }

  return (
    <HistoryWrapper>
      <RecruitSummary
        title="지원 내역"
        subtitle={RECRUIT_MOCK.title}
        rows={[
          { label: '제출 상태', value: '제출완료' },
          { label: '제출 일시', value: toDateTimeLabel(new Date(history.submittedAt)) },
          { label: '지원 파트', value: history.part },
        ]}
        notices={['서류 결과는 결과 공개 후 지원하기 페이지의 [결과 확인]에서 확인할 수 있습니다.']}
        actionLabel="지원하기 페이지로"
        actionGap={74}
        onAction={() => router.push('/recruit')}
      />
    </HistoryWrapper>
  );
};

RecruitHistory.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default RecruitHistory;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px 68px;
`;

const HistoryWrapper = styled(Wrapper)`
  padding-bottom: 20px;
`;
