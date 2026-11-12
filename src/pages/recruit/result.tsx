import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
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
    retry: 1,
    networkMode: 'always',
  });

  const result = resultQuery.data;
  const isFinalTargetMissing =
    RECRUIT_MOCK.phase === 'FINAL_ANNOUNCED' && result?.stage === 'DOCUMENT' && !result.isPassed;

  // 결과를 받기 전까지 로그인 화면을 유지해, 조회에 실패해도 입력값 그대로 다시 로그인하면 재조회한다
  if (!result || isFinalTargetMissing) {
    return (
      <Wrapper>
        <ApplicantLoginForm
          title="결과 확인"
          isApplyOpen={RECRUIT_MOCK.isApplyOpen}
          onSubmittedHistory={(_, loggedInEmail) => {
            if (loggedInEmail === email) resultQuery.refetch();
            else setEmail(loggedInEmail);
          }}
        />
        <ToastWrapper>
          <Toast
            variant="negative"
            text="결과를 불러오지 못했습니다. 다시 시도해주세요"
            show={resultQuery.isError && !resultQuery.isFetching}
          />
        </ToastWrapper>
        {isFinalTargetMissing && (
          <Alert
            heading="최종 결과 확인 대상자가 아닙니다."
            body="최종 결과는 서류전형 합격자에 한해 확인하실 수 있습니다."
            onDimmerClick={() => setEmail(null)}
            actions={[{ label: '닫기', variant: 'primary', onClick: () => setEmail(null) }]}
          />
        )}
      </Wrapper>
    );
  }

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
