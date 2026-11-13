import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Category from '@common/category/Category';
import Divider from '@common/divider/Divider';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import ApplyComplete from '@recruit/apply/ApplyComplete';
import BasicInfoStep from '@recruit/apply/BasicInfoStep';
import IdentityStep from '@recruit/apply/IdentityStep';
import { ApplicantProfile, MOCK_APPLY_END_AT, PART_QUESTIONS_MOCK } from '@recruit/apply/mock';
import PartQuestionStep from '@recruit/apply/PartQuestionStep';
import { RECRUIT_MOCK } from '@recruit/mock';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
import useApplicantSessionStore from 'src/store/useApplicantSessionStore';
import {
  ApplyAnswersDraft,
  ApplyBasicDraft,
  clearApplyDraft,
  deriveDraftKey,
  loadApplyDraft,
  saveApplyDraft,
} from '@utils/applyDraft';
import { Label, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

type ApplyStep = 'identity' | 'basic' | 'part';

const STEP_ITEMS: { key: ApplyStep; label: string }[] = [
  { key: 'identity', label: '0. 본인 확인' },
  { key: 'basic', label: '1. 기본 정보' },
  { key: 'part', label: '2. 파트별 문항' },
];

const getStepSection = (step: ApplyStep, part: string) => {
  if (step === 'identity') {
    return { title: '본인 확인', description: '지원 내역 확인과 결과 조회에 사용할 계정을 만들어주세요' };
  }
  if (step === 'basic') return { title: '기본 정보', description: '지원자의 기본 정보에 대해 알려주세요' };
  return { title: `${part} 파트 문항`, description: '1단계에서 선택한 파트의 문항이에요' };
};

const DRAFT_SAVE_DELAY_MS = 500;

const RecruitApply = () => {
  const router = useRouter();
  const session = useApplicantSessionStore((state) => state.session);
  const setSession = useApplicantSessionStore((state) => state.setSession);
  const clearSession = useApplicantSessionStore((state) => state.clearSession);
  // 지원 내역 확인에서 작성 중인 계정으로 로그인하고 들어오면 1단계부터 이어 쓴다
  const [step, setStep] = useState<ApplyStep>(session ? 'basic' : 'identity');
  const [applicant, setApplicant] = useState<ApplicantProfile | null>(session?.profile ?? null);
  const [basicDraft, setBasicDraft] = useState<{ values: ApplyBasicDraft; hasPortalImage: boolean } | null>(null);
  const [answersDraft, setAnswersDraft] = useState<{ answers: ApplyAnswersDraft; hasFiles: boolean } | null>(null);
  // 불러온 2단계 답변은 2단계에 들어가기 전까지 여기에 두고, 파트를 바꾸면 버린다
  const [restoredAnswers, setRestoredAnswers] = useState<ApplyAnswersDraft | null>(null);
  const [isFileNoticeDismissed, setIsFileNoticeDismissed] = useState(false);
  const [part, setPart] = useState('');
  // 1단계로 돌아가도 2단계 답변이 남아 있도록 한 번 들어간 2단계는 화면에서 숨기기만 한다
  const [hasVisitedPart, setHasVisitedPart] = useState(false);
  const [isPartDirty, setIsPartDirty] = useState(false);
  // 파트를 바꾸면 2단계를 새로 그려 답변을 초기화한다
  const [partResetKey, setPartResetKey] = useState(0);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const { isConfirmOpen, requestLeave, confirmLeave, cancelLeave } = useLeaveGuard(
    step === 'part' && isPartDirty && !submittedAt,
  );

  const draftQuery = useQuery({
    queryKey: ['applyDraft', session?.profile.email],
    queryFn: async () => (session ? loadApplyDraft(session.profile.email, session.draftKey) : null),
    enabled: !!session,
    // 브라우저 저장소만 읽으므로 오프라인이어도 멈추지 않게 한다
    networkMode: 'always',
    staleTime: Infinity,
    gcTime: 0,
  });
  const restoredDraft = draftQuery.data;

  const [syncedDraft, setSyncedDraft] = useState(restoredDraft);
  if (restoredDraft !== syncedDraft) {
    setSyncedDraft(restoredDraft);
    setRestoredAnswers(restoredDraft?.answers ?? null);
  }

  const changeBasicDraft = useCallback(
    (values: ApplyBasicDraft, hasPortalImage: boolean) => setBasicDraft({ values, hasPortalImage }),
    [],
  );
  const changeAnswersDraft = useCallback(
    (answers: ApplyAnswersDraft, hasFiles: boolean) => setAnswersDraft({ answers, hasFiles }),
    [],
  );

  // 저장은 차례대로 이어 붙여, 제출할 때 진행 중인 저장이 끝난 뒤 지울 수 있게 한다
  const pendingSaveRef = useRef<(() => Promise<boolean>) | null>(null);
  const savingRef = useRef<Promise<unknown>>(Promise.resolve());
  const isSubmittedRef = useRef(false);
  const lastSaveOkRef = useRef(true);
  const [isSaveFailedNoticeOpen, setIsSaveFailedNoticeOpen] = useState(false);

  const runPendingSave = useCallback(() => {
    const save = pendingSaveRef.current;
    pendingSaveRef.current = null;
    if (!save || isSubmittedRef.current) return;
    savingRef.current = savingRef.current.then(save).then((isSaved) => {
      // 실패할 때마다가 아니라 저장되다가 처음 실패했을 때만 알린다
      if (!isSaved && lastSaveOkRef.current) setIsSaveFailedNoticeOpen(true);
      lastSaveOkRef.current = isSaved;
    });
  }, []);

  useEffect(() => {
    if (!session || !basicDraft || submittedAt) return;
    pendingSaveRef.current = () =>
      saveApplyDraft(
        session.profile.email,
        session.draftKey,
        {
          basic: basicDraft.values,
          answers: answersDraft?.answers ?? restoredAnswers ?? { texts: {}, choices: {} },
          hasFiles: basicDraft.hasPortalImage || !!answersDraft?.hasFiles,
        },
        MOCK_APPLY_END_AT,
      );
    const timer = setTimeout(runPendingSave, DRAFT_SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [session, basicDraft, answersDraft, restoredAnswers, submittedAt, runPendingSave]);

  // 입력 직후 다른 페이지로 이동해도 예약된 저장을 버리지 않는다
  useEffect(() => () => runPendingSave(), [runPendingSave]);

  // 지원서 작성은 접수 기간 중 [지원하기]로만 들어올 수 있다
  useEffect(() => {
    if (!RECRUIT_MOCK.isApplyOpen) router.replace('/recruit');
  }, [router]);

  const goToStep = (nextStep: ApplyStep) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  if (!RECRUIT_MOCK.isApplyOpen || (session && draftQuery.isPending)) return null;

  const section = getStepSection(step, part);

  if (submittedAt) {
    return (
      <CompleteWrapper>
        <ApplyComplete generation={RECRUIT_MOCK.generation} submittedAt={submittedAt} part={part} />
      </CompleteWrapper>
    );
  }

  return (
    <Wrapper>
      <Content>
        <Header>
          <PageTitle>지원서 작성</PageTitle>
          <StepCategory items={STEP_ITEMS} activeKey={step} size="xlarge" onChange={() => {}} />
        </Header>
        <SectionHeader>
          <SectionTitleGroup>
            <SectionTitle>{section.title}</SectionTitle>
            <SectionDescription>{section.description}</SectionDescription>
          </SectionTitleGroup>
          <Divider />
        </SectionHeader>
        {step === 'identity' && (
          <IdentityStep
            onComplete={async (profile, password) => {
              await clearApplyDraft(profile.email);
              setSession({ profile, draftKey: await deriveDraftKey(profile.email, password) });
              setApplicant(profile);
              goToStep('basic');
            }}
          />
        )}
        {applicant && (
          <div hidden={step !== 'basic'}>
            <BasicInfoStep
              applicant={applicant}
              hasPartAnswers={isPartDirty || !!restoredAnswers}
              initialValues={restoredDraft?.basic}
              onPartReset={() => {
                setRestoredAnswers(null);
                setPartResetKey((prev) => prev + 1);
              }}
              onValuesChange={changeBasicDraft}
              onNext={(selectedPart) => {
                setPart(selectedPart);
                setHasVisitedPart(true);
                goToStep('part');
              }}
            />
          </div>
        )}
        {hasVisitedPart && (
          <div hidden={step !== 'part'}>
            <PartQuestionStep
              key={partResetKey}
              questions={PART_QUESTIONS_MOCK}
              initialAnswers={restoredAnswers ?? undefined}
              onPrev={() => requestLeave(() => goToStep('basic'))}
              onDirtyChange={setIsPartDirty}
              onAnswersChange={changeAnswersDraft}
              onSubmitted={(date) => {
                isSubmittedRef.current = true;
                pendingSaveRef.current = null;
                if (applicant) savingRef.current.then(() => clearApplyDraft(applicant.email));
                clearSession();
                setSubmittedAt(date);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        )}
      </Content>
      <ToastWrapper>
        <Toast
          variant="positive"
          text="이전에 작성하던 지원서를 불러왔습니다. 첨부 파일은 다시 업로드 해주세요."
          show={!!restoredDraft?.hasFiles && !isFileNoticeDismissed}
          onHidden={() => setIsFileNoticeDismissed(true)}
        />
        <Toast
          variant="negative"
          text="브라우저에 임시 저장하지 못했습니다. 저장 공간을 확인해 주세요."
          show={isSaveFailedNoticeOpen}
          onHidden={() => setIsSaveFailedNoticeOpen(false)}
        />
      </ToastWrapper>
      {isConfirmOpen && (
        <Alert
          heading="페이지를 나가시겠어요?"
          body="작성 중인 내용은 현재 브라우저에만 임시 저장되며, 모집 마감 후 삭제됩니다."
          onDimmerClick={cancelLeave}
          actions={[
            { label: '취소', variant: 'assistive', onClick: cancelLeave },
            { label: '나가기', variant: 'primary', onClick: confirmLeave },
          ]}
        />
      )}
    </Wrapper>
  );
};

RecruitApply.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default RecruitApply;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 80px 20px 68px;

  ${media.xs} {
    padding-top: 40px;
  }
`;

// 제출 완료 화면은 버튼과 푸터 사이 여백이 Figma 기준 113px(레이아웃 하단 여백 93px 포함)
const CompleteWrapper = styled(Wrapper)`
  padding-top: 0;
  padding-bottom: 20px;

  ${media.xs} {
    padding-top: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 52px;
  width: 100%;
  max-width: 520px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${Orange.o500};
  text-align: center;
  ${typographyCss(Typography.display2.bold)}
`;

// 단계 표시용이라 칩을 눌러 이동하지 않고, 선택된 칩은 주황색으로 표시한다
const StepCategory = styled(Category)`
  & > button {
    cursor: default;
  }

  & > button[aria-selected='true'] {
    background-color: ${Orange.o500};
    font-weight: 600;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
`;

const SectionTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.title1.bold)}
`;

const SectionDescription = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.heading2.medium)}
`;
