import styled from 'styled-components';
import { ReactElement, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainSection from '@home/main/MainSection';
import IntroduceSection from '@home/introduction/IntroduceSection';
import TrackSection from '@home/track/TrackSection';
import ActivitySection from '@home/activity/ActivitySection';
import FAQSection from '@home/faq/FAQSection';
import LayoutLanding from '@common/layout/LayoutLanding';
import MainPageHead from 'src/components/meta/MainPageHead';
import Toast from '@common/toast/Toast';
import { LOGOUT_SUCCESS_FLAG_KEY } from 'src/apis/account';

const ProjectSection = dynamic(() => import('@home/project/ProjectSection'), { ssr: false });

function Landing() {
  const [showLogoutToast, setShowLogoutToast] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(LOGOUT_SUCCESS_FLAG_KEY) === 'true';
  });

  useEffect(() => {
    if (!showLogoutToast) return;
    sessionStorage.removeItem(LOGOUT_SUCCESS_FLAG_KEY);
  }, [showLogoutToast]);

  return (
    <>
      <MainPageHead canoUrl="https://cau-likelion.org/" />
      <ToastWrapper>
        <Toast
          variant="positive"
          text="로그아웃이 완료되었습니다."
          show={showLogoutToast}
          width={348}
          onHidden={() => setShowLogoutToast(false)}
        />
      </ToastWrapper>
      <SectionWrapper>
        <HeroGroup>
          <MainSection />
          <IntroduceSection />
        </HeroGroup>
        <TrackSection />
        <ActivitySection />
        <ProjectSection />
        <FAQSection />
      </SectionWrapper>
    </>
  );
}
Landing.getLayout = function getLayout(page: ReactElement) {
  return <LayoutLanding>{page}</LayoutLanding>;
};

export default Landing;
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const HeroGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
