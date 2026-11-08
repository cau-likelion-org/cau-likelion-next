import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Alert from '@common/alert/Alert';
import Category from '@common/category/Category';
import Divider from '@common/divider/Divider';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import ApplyComplete from '@recruit/apply/ApplyComplete';
import BasicInfoStep from '@recruit/apply/BasicInfoStep';
import IdentityStep from '@recruit/apply/IdentityStep';
import { ApplicantProfile, PART_QUESTIONS_MOCK } from '@recruit/apply/mock';
import PartQuestionStep from '@recruit/apply/PartQuestionStep';
import { RECRUIT_MOCK } from '@recruit/mock';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
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

const RecruitApply = () => {
  const router = useRouter();
  const [step, setStep] = useState<ApplyStep>('identity');
  const [applicant, setApplicant] = useState<ApplicantProfile | null>(null);
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

  // 지원서 작성은 접수 기간 중 [지원하기]로만 들어올 수 있다
  useEffect(() => {
    if (!RECRUIT_MOCK.isApplyOpen) router.replace('/recruit');
  }, [router]);

  const goToStep = (nextStep: ApplyStep) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  if (!RECRUIT_MOCK.isApplyOpen) return null;

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
            onComplete={(profile) => {
              setApplicant(profile);
              goToStep('basic');
            }}
          />
        )}
        {applicant && (
          <div hidden={step !== 'basic'}>
            <BasicInfoStep
              applicant={applicant}
              hasPartAnswers={isPartDirty}
              onPartReset={() => setPartResetKey((prev) => prev + 1)}
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
              onPrev={() => requestLeave(() => goToStep('basic'))}
              onDirtyChange={setIsPartDirty}
              onSubmitted={(date) => {
                setSubmittedAt(date);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        )}
      </Content>
      {isConfirmOpen && (
        <Alert
          heading="작성 중인 내용은 저장되지 않습니다."
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
  padding-bottom: 20px;
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
