import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import TalentSection from '@about/talent/TalentSection';
import CurriculumSection from '@about/curriculum/CurriculumSection';
import RoadmapSection from '@about/roadmap/RoadmapSection';
import RecruitHeroSection from '@recruit/RecruitHeroSection';
import RecruitFAQSection from '@recruit/RecruitFAQSection';
import { RECRUIT_MOCK } from '@recruit/mock';
import MainPageHead from 'src/components/meta/MainPageHead';

const Recruit = () => {
  const router = useRouter();

  return (
    <>
      <MainPageHead canoUrl="https://cau-likelion.org/recruit" />
      <RecruitHeroSection recruit={RECRUIT_MOCK} />
      <TalentSection />
      <CurriculumSection />
      <RoadmapSection />
      <RecruitFAQSection faqs={RECRUIT_MOCK.faqs} />
      <BottomAction>
        <ApplyButton disabled={!RECRUIT_MOCK.isApplyOpen} onClick={() => router.push('/recruit/apply')}>
          지원하기
        </ApplyButton>
      </BottomAction>
    </>
  );
};

Recruit.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default Recruit;

const BottomAction = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 60px 20px 40px;
`;

const ApplyButton = styled(Button)`
  width: 277px;
`;
