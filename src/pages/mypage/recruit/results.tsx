import { ReactElement, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import EmptyState from '@common/emptyState/EmptyState';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import TextSelect from '@common/select/TextSelect';
import Tab from '@common/tab/Tab';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import MyPageShell from '@mypage/component/MyPageShell';
import { APPLICANT_GENERATIONS } from '@mypage/recruit/applicantMock';
import ScreeningStageView from '@mypage/recruit/results/ScreeningStageView';
import { ScreeningStage, getScreeningData } from '@mypage/recruit/results/resultMock';
import useRoleGuard from 'src/apis/useRoleGuard';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
import { canManageRecruit } from '@utils/index';
import { Black } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const STAGE_TABS: { key: ScreeningStage; label: string }[] = [
  { key: 'DOCUMENT', label: '서류 전형' },
  { key: 'FINAL', label: '면접 전형' },
];

const toGenerationLabel = (generation: number) => `${generation}기 모집`;

const MyPageRecruitResults = () => {
  const { isAuthorized, isUserProfileError } = useRoleGuard(canManageRecruit);
  const [generation, setGeneration] = useState(APPLICANT_GENERATIONS[0]);
  const [stage, setStage] = useState<ScreeningStage>('DOCUMENT');
  const [toastMessage, setToastMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const { isConfirmOpen, requestLeave, confirmLeave, cancelLeave } = useLeaveGuard(isDirty);

  const screeningQuery = useQuery({
    queryKey: ['recruitScreening', generation],
    queryFn: () => getScreeningData(generation),
    enabled: isAuthorized,
  });

  if (!isAuthorized) return <PageLoadingGate isError={isUserProfileError} />;

  return (
    <Root>
      <TitleRow>
        <Title>전형 결과 관리</Title>
        <TextSelect
          ariaLabel="모집 기수"
          options={APPLICANT_GENERATIONS.map(toGenerationLabel)}
          value={toGenerationLabel(generation)}
          onChange={(label) => requestLeave(() => setGeneration(Number.parseInt(label, 10)))}
        />
      </TitleRow>
      <Tab
        items={STAGE_TABS}
        activeKey={stage}
        onChange={(key) => requestLeave(() => setStage(key as ScreeningStage))}
        size="large"
      />
      {screeningQuery.data &&
        (screeningQuery.data.applicants.length === 0 ? (
          <Empty message="아직 지원자가 없습니다" />
        ) : (
          <ScreeningStageView
            key={`${generation}-${stage}`}
            stage={stage}
            generation={generation}
            data={screeningQuery.data}
            onToast={setToastMessage}
            onDirtyChange={setIsDirty}
          />
        ))}
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {isConfirmOpen && (
        <Alert
          heading="저장하지 않고 나가면 작성한 내용이 사라집니다."
          onDimmerClick={cancelLeave}
          actions={[
            { label: '취소', variant: 'assistive', onClick: cancelLeave },
            { label: '나가기', variant: 'primary', onClick: confirmLeave },
          ]}
        />
      )}
    </Root>
  );
};

MyPageRecruitResults.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="recruit-results">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageRecruitResults;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 38px;
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title2.bold)}
`;

const Empty = styled(EmptyState)`
  padding: 120px 0;
`;
