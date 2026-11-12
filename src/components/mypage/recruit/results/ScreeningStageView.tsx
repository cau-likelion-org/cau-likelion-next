import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Button from '@common/button/Button';
import Category from '@common/category/Category';
import EmptyState from '@common/emptyState/EmptyState';
import { toDateTimeLabel } from '@utils/index';
import { Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { ScreeningResult } from '../applicantMock';
import InterviewInfoSection, { isInterviewInfoFilled } from './InterviewInfoSection';
import ResultInputSection, { getSavedResult } from './ResultInputSection';
import ResultReservationSection, { ReservationInput } from './ResultReservationSection';
import { BorderBox } from './ResultSection';
import ResultTemplateSection from './ResultTemplateSection';
import {
  InterviewInfo,
  ScreeningData,
  ScreeningStage,
  TemplateKey,
  cancelReservation,
  reservePublish,
  saveInterviewInfos,
  saveScreeningResults,
  saveTemplates,
} from './resultMock';

type StepKey = 'result' | 'interview' | 'template' | 'reservation';

const STAGE_CONFIG: Record<
  ScreeningStage,
  { label: string; resultTitle: string; templateKeys: TemplateKey[]; lockedTarget: string; steps: StepKey[] }
> = {
  DOCUMENT: {
    label: '서류',
    resultTitle: '결과 입력',
    templateKeys: ['DOCUMENT_PASS', 'DOCUMENT_FAIL'],
    lockedTarget: '결과, 면접 정보, 결과 안내문',
    steps: ['result', 'interview', 'template', 'reservation'],
  },
  FINAL: {
    label: '최종',
    resultTitle: '면접 결과 입력',
    templateKeys: ['FINAL_PASS', 'FINAL_FAIL'],
    lockedTarget: '면접 결과, 결과 안내문',
    steps: ['result', 'template', 'reservation'],
  },
};

const STEP_TITLE: Record<StepKey, string> = {
  result: '결과 입력',
  interview: '면접 정보 입력',
  template: '결과 안내문',
  reservation: '결과 공개 예약',
};

const omitSaved = <T extends object>(pending: T, saved: T): T =>
  Object.fromEntries(Object.entries(pending).filter(([key, value]) => saved[key as keyof T] !== value)) as T;

const PUBLISHED_CONFIRM = '이미 공개된 결과입니다.\n저장하면 지원자에게 즉시 반영됩니다.';

export interface ScreeningStageViewProps {
  stage: ScreeningStage;
  generation: number;
  data: ScreeningData;
  onToast: (message: string) => void;
  onDirtyChange: (isDirty: boolean) => void;
}

const ScreeningStageView = ({ stage, generation, data, onToast, onDirtyChange }: ScreeningStageViewProps) => {
  const queryClient = useQueryClient();
  const config = STAGE_CONFIG[stage];
  const publish = data.publish[stage];
  const isLocked = publish.status === 'RESERVED';
  const isPublished = publish.status === 'PUBLISHED';

  const [activeStep, setActiveStep] = useState<StepKey>('result');
  const [resultPending, setResultPending] = useState<Record<number, ScreeningResult>>({});
  const [interviewPending, setInterviewPending] = useState<Record<number, InterviewInfo>>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [templatePending, setTemplatePending] = useState<Partial<Record<TemplateKey, string>>>({});
  const [confirm, setConfirm] = useState<{ heading: string; onConfirm: () => void } | null>(null);
  const [notice, setNotice] = useState('');

  const resultRef = useRef<HTMLElement>(null);
  const interviewRef = useRef<HTMLElement>(null);
  const templateRef = useRef<HTMLElement>(null);
  const reservationRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const isDirty =
    Object.keys(resultPending).length > 0 ||
    Object.keys(interviewPending).length > 0 ||
    Object.entries(templatePending).some(([key, value]) => value !== data.templates[key as TemplateKey]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  // 흐리게 막은 화면도 키보드로는 저장할 수 있어 inert로 초점 이동까지 막는다 (React 18 타입에 inert가 없다)
  useEffect(() => {
    stepsRef.current?.toggleAttribute('inert', isLocked);
  }, [isLocked]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['recruitScreening', generation] });
  const afterSave = (message: string) => {
    refresh();
    onToast(message);
  };

  const resultMutation = useMutation({
    mutationFn: saveScreeningResults,
    onSuccess: (_, { results }) => {
      setResultPending((prev) => omitSaved(prev, results));
      if (stage === 'DOCUMENT') {
        setInterviewPending((prev) =>
          Object.fromEntries(Object.entries(prev).filter(([id]) => (results[Number(id)] ?? 'PASS') === 'PASS')),
        );
      }
      afterSave('변경사항이 저장되었습니다.');
    },
  });
  const interviewMutation = useMutation({
    mutationFn: saveInterviewInfos,
    onSuccess: (_, { infos }) => {
      setInterviewPending((prev) => omitSaved(prev, infos));
      afterSave('변경사항이 저장되었습니다.');
    },
  });
  const templateMutation = useMutation({
    mutationFn: saveTemplates,
    onSuccess: (_, { templates }) => {
      setTemplatePending((prev) => omitSaved(prev, templates));
      afterSave('결과 안내문이 저장되었습니다.');
    },
  });
  const reserveMutation = useMutation({
    mutationFn: reservePublish,
    onSuccess: () => afterSave('결과 공개가 예약되었습니다.'),
  });
  const cancelMutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => afterSave('결과 공개 예약이 취소되었습니다.'),
  });

  const documentPublished = data.publish.DOCUMENT.status === 'PUBLISHED';
  if (stage === 'FINAL' && !documentPublished) {
    return <StageEmpty message="면접 전형은 서류 결과 공개 후 입력할 수 있습니다" />;
  }

  const eligible =
    stage === 'DOCUMENT' ? data.applicants : data.applicants.filter((item) => item.documentResult === 'PASS');
  const documentPassed = data.applicants.filter(
    (applicant) => (resultPending[applicant.id] ?? applicant.documentResult) === 'PASS',
  );
  const savedDocumentPassed = data.applicants.filter((applicant) => applicant.documentResult === 'PASS');
  const selectedApplicant = eligible.find((applicant) => applicant.id === selectedIds[0]);

  const confirmOrRun = (run: () => void, heading = '변경사항을 저장하시겠습니까?') =>
    setConfirm({ heading: isPublished ? PUBLISHED_CONFIRM : heading, onConfirm: run });

  const saveResults = () => {
    if (isLocked) return;
    if (stage === 'DOCUMENT' && isPublished) {
      const missingInterview = Object.entries(resultPending).some(
        ([id, result]) => result === 'PASS' && !isInterviewInfoFilled(data.interviews[Number(id)]),
      );
      if (missingInterview) {
        setNotice('합격으로 바꾼 지원자의 면접 정보를 먼저 저장해 주세요.');
        return;
      }
    }
    confirmOrRun(() => resultMutation.mutate({ generation, stage, results: resultPending }));
  };

  const saveInterviews = () => {
    if (isLocked) return;
    const run = () => interviewMutation.mutate({ generation, infos: interviewPending });
    if (isPublished) confirmOrRun(run);
    else run();
  };

  const conditions =
    stage === 'DOCUMENT'
      ? [
          {
            label: '지원자 전원 서류 결과 입력 (보류 포함)',
            done: eligible.filter((applicant) => applicant.documentResult).length,
            total: eligible.length,
          },
          {
            label: '서류 합격자 전원 면접 일시·대기 장소 입력',
            done: savedDocumentPassed.filter((applicant) => isInterviewInfoFilled(data.interviews[applicant.id]))
              .length,
            total: savedDocumentPassed.length,
          },
          {
            label: '서류 합격·불합격 안내문 작성',
            done: config.templateKeys.filter((key) => data.savedTemplates.includes(key)).length,
            total: config.templateKeys.length,
          },
        ]
      : [
          {
            label: '서류 합격자 전원 면접 결과 입력 (보류 포함)',
            done: eligible.filter((applicant) => getSavedResult(stage, applicant)).length,
            total: eligible.length,
          },
          {
            label: '최종 합격·불합격 안내문 작성',
            done: config.templateKeys.filter((key) => data.savedTemplates.includes(key)).length,
            total: config.templateKeys.length,
          },
        ];

  const stepTitle = (step: StepKey) => `${config.steps.indexOf(step) + 1}. ${STEP_TITLE[step]}`;
  const resultTitle = `${config.steps.indexOf('result') + 1}. ${config.resultTitle}`;

  const moveToStep = (step: StepKey) => {
    setActiveStep(step);
    const refs = { result: resultRef, interview: interviewRef, template: templateRef, reservation: reservationRef };
    refs[step].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Root>
      {isLocked && publish.publishAt && (
        <Banner>
          <BannerText>
            <BannerTitle>
              {config.label} 결과 공개가{' '}
              <Accent>{toDateTimeLabel(new Date(`${publish.publishAt}:00+09:00`))}에 예약</Accent>되어 있습니다
            </BannerTitle>
            <BannerDescription>
              {config.lockedTarget}이 잠겨 있으며 예약을 취소하면 수정할 수 있습니다.
            </BannerDescription>
          </BannerText>
          <Button
            size="small"
            loading={cancelMutation.isPending}
            onClick={() => cancelMutation.mutate({ generation, stage })}
          >
            예약 취소
          </Button>
        </Banner>
      )}
      <Steps ref={stepsRef} $locked={isLocked} aria-disabled={isLocked}>
        <StepCategory
          variant="accent"
          size="xlarge"
          items={config.steps.map((step) => ({ key: step, label: stepTitle(step) }))}
          activeKey={activeStep}
          onChange={(key) => moveToStep(key as StepKey)}
        />
        <ResultInputSection
          ref={resultRef}
          title={resultTitle}
          stage={stage}
          applicants={eligible}
          isPublished={isPublished}
          interviews={data.interviews}
          pending={resultPending}
          selectedIds={selectedIds}
          saving={resultMutation.isPending}
          onPendingChange={setResultPending}
          onSelectedIdsChange={setSelectedIds}
          onSave={saveResults}
        />
        {stage === 'DOCUMENT' && (
          <InterviewInfoSection
            ref={interviewRef}
            title={stepTitle('interview')}
            applicants={documentPassed}
            interviews={data.interviews}
            pending={interviewPending}
            saving={interviewMutation.isPending}
            onPendingChange={setInterviewPending}
            onSave={saveInterviews}
          />
        )}
        <ResultTemplateSection
          ref={templateRef}
          title={stepTitle('template')}
          templateKeys={config.templateKeys}
          templates={data.templates}
          savedTemplates={data.savedTemplates}
          pending={templatePending}
          previewApplicant={
            selectedApplicant && { name: selectedApplicant.name, interview: data.interviews[selectedApplicant.id] }
          }
          saving={templateMutation.isPending}
          onPendingChange={setTemplatePending}
          onSave={() => !isLocked && templateMutation.mutate({ generation, templates: templatePending })}
        />
        <ResultReservationSection
          ref={reservationRef}
          title={stepTitle('reservation')}
          stageLabel={config.label}
          conditions={conditions}
          publish={publish}
          needsResultEndDate={stage === 'FINAL'}
          saving={reserveMutation.isPending}
          onReserve={(input: ReservationInput) => reserveMutation.mutate({ generation, stage, ...input })}
        />
      </Steps>
      {confirm && (
        <Alert
          heading={confirm.heading}
          onDimmerClick={() => setConfirm(null)}
          actions={[
            { label: '취소', variant: 'assistive', onClick: () => setConfirm(null) },
            {
              label: '저장',
              variant: 'primary',
              onClick: () => {
                confirm.onConfirm();
                setConfirm(null);
              },
            },
          ]}
        />
      )}
      {notice && (
        <Alert
          heading={notice}
          onDimmerClick={() => setNotice('')}
          actions={[{ label: '확인', variant: 'primary', onClick: () => setNotice('') }]}
        />
      )}
    </Root>
  );
};

export default ScreeningStageView;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 38px;
`;

const StageEmpty = styled(EmptyState)`
  padding: 120px 0;
`;

const Banner = styled(BorderBox)`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
`;

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BannerTitle = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const Accent = styled.span`
  color: ${Orange.o500};
`;

const BannerDescription = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Steps = styled.div<{ $locked: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 38px;
  ${(props) => props.$locked && 'opacity: 0.43; pointer-events: none; user-select: none;'}
`;

const StepCategory = styled(Category)`
  gap: 10px;
`;
