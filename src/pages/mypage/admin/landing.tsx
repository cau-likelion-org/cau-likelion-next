import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import MyPageShell from '@mypage/component/MyPageShell';
import IntroduceSection, { LandingMetrics, isMetricsInvalid } from '@mypage/admin/IntroduceSection';
import TrackSection, { TrackIntroItem, isTrackItemInvalid } from '@mypage/admin/TrackSection';
import ActivitySection, { ActivityIntroItem, isActivityItemInvalid } from '@mypage/admin/ActivitySection';
import ProjectSection, { FeaturedProject } from '@mypage/admin/ProjectSection';
import FAQSection, { FaqItem, isFaqItemInvalid } from '@mypage/admin/FAQSection';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { TRACK, TRACK_NAME } from '@utils/constant';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 백엔드 API 준비 전까지 사용하는 목 데이터
const MOCK_METRICS: LandingMetrics = { generationCount: '14', graduateCount: '230+', projectCount: '60' };

const MOCK_TRACK_ITEMS: TrackIntroItem[] = [
  {
    id: 'pm_design',
    nameKo: TRACK_NAME[TRACK.PM_DESIGN],
    nameEn: 'Product Manage/Product Design',
    description: '리스트\n리스트\n리스트',
    techStack: ['Figma', 'UX/UI', 'Prototyping', 'Service design'],
  },
  {
    id: 'frontend',
    nameKo: TRACK_NAME[TRACK.FRONTEND],
    nameEn: 'Frontend Devlopment',
    description: '리스트\n리스트\n리스트',
    techStack: ['Figma', 'UX/UI', 'Prototyping', 'Service design'],
  },
  {
    id: 'backend',
    nameKo: TRACK_NAME[TRACK.BACKEND],
    nameEn: 'Backend Devlopment',
    description: '리스트\n리스트\n리스트',
    techStack: ['Figma', 'UX/UI', 'Prototyping', 'Service design'],
  },
];

const MOCK_ACTIVITY_ITEMS: ActivityIntroItem[] = [
  {
    id: 'session',
    title: '세션',
    imageName: '',
    subtitle: '일주일에 1번 정기적 대면 모임',
    description: '소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글',
    buttonText: '파트별 커리큘럼 보기',
    href: '소개 페이지 / 커리큘럼 영역',
  },
  {
    id: 'project',
    title: '프로젝트',
    imageName: '',
    subtitle: '일주일에 1번 정기적 대면 모임',
    description: '소개글 소개글 소개글 소개글 소개글 소개글 소개글 소개글',
    buttonText: '프로젝트 더보기',
    href: '프로젝트 페이지',
  },
];

const PROJECT_CATEGORY_CYCLE = ['아이디어톤', '해커톤', '중커톤'];
const MOCK_PROJECTS: FeaturedProject[] = Array.from({ length: 60 }, (_, index) => ({
  id: `project-${index}`,
  name: '서비스명',
  generation: index % 2 === 0 ? '13기' : '14기',
  category: PROJECT_CATEGORY_CYCLE[index % PROJECT_CATEGORY_CYCLE.length],
  selected: true,
}));

const MOCK_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Q. 모집은 언제 이뤄지나요?',
    answer: '보통 12월에 리크루팅 모집을 시작하고 2월에 최종 발표합니다.',
  },
  { id: 'faq-2', question: 'Q. 질문 내용 질문 내용 질문 내용', answer: '답변 내용 답변 내용 답변 내용 답변 내용' },
];

const MyPageAdminLanding = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [trackItems, setTrackItems] = useState(MOCK_TRACK_ITEMS);
  const [activityItems, setActivityItems] = useState(MOCK_ACTIVITY_ITEMS);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [faqItems, setFaqItems] = useState(MOCK_FAQ_ITEMS);
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !userProfile.is_admin) router.push('/mypage');
  }, [userProfile, router]);

  const handleCancel = () => {
    setMetrics(MOCK_METRICS);
    setTrackItems(MOCK_TRACK_ITEMS);
    setActivityItems(MOCK_ACTIVITY_ITEMS);
    setProjects(MOCK_PROJECTS);
    setFaqItems(MOCK_FAQ_ITEMS);
    setShowErrors(false);
  };

  const handleSave = () => {
    const hasError =
      isMetricsInvalid(metrics) ||
      trackItems.some(isTrackItemInvalid) ||
      activityItems.some(isActivityItemInvalid) ||
      faqItems.some(isFaqItemInvalid);

    if (hasError) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setToastMessage('변경사항이 저장되었습니다.');
  };

  if (!userProfile || !userProfile.is_admin) return null;

  return (
    <>
      <MyPageShell active="admin-landing" isAdmin={userProfile.is_admin}>
        <TitleRow>
          <PageTitle>랜딩페이지 관리</PageTitle>
          <ButtonRow>
            <Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
              취소
            </Button>
            <Button size="small" onClick={handleSave}>
              저장
            </Button>
          </ButtonRow>
        </TitleRow>
        <IntroduceSection metrics={metrics} onChange={setMetrics} showErrors={showErrors} />
        <TrackSection items={trackItems} onChange={setTrackItems} showErrors={showErrors} />
        <ActivitySection items={activityItems} onChange={setActivityItems} showErrors={showErrors} />
        <ProjectSection projects={projects} onChange={setProjects} />
        <FAQSection items={faqItems} onChange={setFaqItems} showErrors={showErrors} />
      </MyPageShell>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
    </>
  );
};

MyPageAdminLanding.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAdminLanding;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const PageTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
