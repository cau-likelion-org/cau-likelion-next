import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import ApplicantLoginForm from '@recruit/history/ApplicantLoginForm';
import { RECRUIT_MOCK } from '@recruit/mock';
import RecruitResultLayout from '@recruit/RecruitResultLayout';
import { getRecruitResult } from '@recruit/result/mock';
import RecruitResultMessage from '@recruit/result/RecruitResultMessage';

const RecruitResultPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  const resultQuery = useQuery({
    queryKey: ['recruitResult', email],
    queryFn: () => getRecruitResult(email ?? ''),
    enabled: !!email,
  });

  if (!email) {
    return (
      <Wrapper>
        <ApplicantLoginForm
          title="결과 확인"
          isApplyOpen={RECRUIT_MOCK.isApplyOpen}
          onSubmittedHistory={(_, loggedInEmail) => setEmail(loggedInEmail)}
        />
      </Wrapper>
    );
  }

  const result = resultQuery.data;
  if (!result) return null;

  const isDocumentPassed = result.stage === 'DOCUMENT' && result.isPassed;

  return (
    <ResultWrapper>
      <RecruitResultLayout
        title={result.stage === 'DOCUMENT' ? '서류 전형 결과' : '최종 결과'}
        subtitle={RECRUIT_MOCK.title}
        actionLabel={isDocumentPassed ? '지원하기 페이지로' : '메인 페이지로'}
        actionGap={54}
        onAction={() => router.push(isDocumentPassed ? '/recruit' : '/')}
      >
        <RecruitResultMessage generation={RECRUIT_MOCK.generation} result={result} />
      </RecruitResultLayout>
    </ResultWrapper>
  );
};

RecruitResultPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default RecruitResultPage;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px 68px;
`;

const ResultWrapper = styled(Wrapper)`
  padding-bottom: 20px;
`;
