import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Category from '@common/category/Category';
import Divider from '@common/divider/Divider';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import BasicInfoStep from '@recruit/apply/BasicInfoStep';
import IdentityStep from '@recruit/apply/IdentityStep';
import { ApplicantProfile } from '@recruit/apply/mock';
import { RECRUIT_MOCK } from '@recruit/mock';
import { Label, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

type ApplyStep = 'identity' | 'basic' | 'part';

const STEP_ITEMS: { key: ApplyStep; label: string }[] = [
  { key: 'identity', label: '0. 본인 확인' },
  { key: 'basic', label: '1. 기본 정보' },
  { key: 'part', label: '2. 파트별 문항' },
];

// 파트별 문항 단계는 아직 구현 전이라 머리말이 없다
const STEP_SECTION: Record<Exclude<ApplyStep, 'part'>, { title: string; description: string }> = {
  identity: { title: '본인 확인', description: '지원 내역 확인과 결과 조회에 사용할 계정을 만들어주세요' },
  basic: { title: '기본 정보', description: '지원자의 기본 정보에 대해 알려주세요' },
};

const RecruitApply = () => {
  const router = useRouter();
  const [step, setStep] = useState<ApplyStep>('identity');
  const [applicant, setApplicant] = useState<ApplicantProfile | null>(null);

  // 지원서 작성은 접수 기간 중 [지원하기]로만 들어올 수 있다
  useEffect(() => {
    if (!RECRUIT_MOCK.isApplyOpen) router.replace('/recruit');
  }, [router]);

  const goToStep = (nextStep: ApplyStep) => {
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  if (!RECRUIT_MOCK.isApplyOpen) return null;

  return (
    <Wrapper>
      <Content>
        <Header>
          <PageTitle>지원서 작성</PageTitle>
          <StepCategory items={STEP_ITEMS} activeKey={step} size="xlarge" onChange={() => {}} />
        </Header>
        {step !== 'part' && (
          <SectionHeader>
            <SectionTitleGroup>
              <SectionTitle>{STEP_SECTION[step].title}</SectionTitle>
              <SectionDescription>{STEP_SECTION[step].description}</SectionDescription>
            </SectionTitleGroup>
            <Divider />
          </SectionHeader>
        )}
        {step === 'identity' && (
          <IdentityStep
            onComplete={(profile) => {
              setApplicant(profile);
              goToStep('basic');
            }}
          />
        )}
        {step === 'basic' && applicant && <BasicInfoStep applicant={applicant} onNext={() => goToStep('part')} />}
      </Content>
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
