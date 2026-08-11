import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import Toast from '@common/toast/Toast';
import MyPageShell from '@mypage/component/MyPageShell';
import IntroduceSection, { LandingMetrics, isMetricsInvalid } from '@mypage/admin/IntroduceSection';
import TrackSection, { TrackIntroItem, isTrackItemInvalid } from '@mypage/admin/TrackSection';
import ActivitySection, {
  ActivityIntroItem,
  isActivityItemInvalid,
  PAGE_NAVIGATION_LABEL,
  PAGE_NAVIGATION_BY_LABEL,
} from '@mypage/admin/ActivitySection';
import ProjectSection, { FeaturedProject } from '@mypage/admin/ProjectSection';
import FAQSection, { FaqItem, isFaqItemInvalid } from '@mypage/admin/FAQSection';
import { syncListSection } from '@mypage/admin/utils';
import { getUserProfile } from 'src/apis/account';
import { getTracks, createTrack, updateTrack, deleteTrack, TrackResponse } from 'src/apis/track';
import { getActivities, createActivity, updateActivity, deleteActivity, ActivityResponse } from 'src/apis/activity';
import { getFaqs, createFaq, updateFaq, deleteFaq, FaqResponse } from 'src/apis/faq';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const trackToLocal = (track: TrackResponse): TrackIntroItem => ({
  id: String(track.id),
  nameKo: track.koName,
  nameEn: track.enName,
  description: track.introduction,
  techStack: track.techStack,
});
const trackToRequest = (item: TrackIntroItem) => ({
  koName: item.nameKo,
  enName: item.nameEn,
  introduction: item.description,
  techStack: item.techStack,
});

const activityToLocal = (activity: ActivityResponse): ActivityIntroItem => ({
  id: String(activity.id),
  title: activity.name,
  imageName: activity.imageUrl,
  subtitle: activity.introduction,
  description: activity.description,
  buttonText: activity.buttonName,
  href: PAGE_NAVIGATION_LABEL[activity.pageNavigation],
});
const activityToRequest = (item: ActivityIntroItem) => ({
  name: item.title,
  imageUrl: item.imageName,
  introduction: item.subtitle,
  description: item.description,
  buttonName: item.buttonText,
  pageNavigation: PAGE_NAVIGATION_BY_LABEL[item.href],
});

const faqToLocal = (faq: FaqResponse): FaqItem => ({ id: String(faq.id), question: faq.question, answer: faq.answer });
const faqToRequest = (item: FaqItem) => ({ question: item.question, answer: item.answer });

// 정량지표는 백엔드 필드가 없어 프론트에서만 다루기로 함, 프로젝트 노출선택도 백엔드 필드 추가 전까지 목 데이터 유지
const MOCK_METRICS: LandingMetrics = { generationCount: '14', graduateCount: '230+', projectCount: '60' };

const PROJECT_CATEGORY_CYCLE = ['아이디어톤', '해커톤', '중커톤'];
const MOCK_PROJECTS: FeaturedProject[] = Array.from({ length: 60 }, (_, index) => ({
  id: `project-${index}`,
  name: '서비스명',
  generation: index % 2 === 0 ? '13기' : '14기',
  category: PROJECT_CATEGORY_CYCLE[index % PROJECT_CATEGORY_CYCLE.length],
  selected: true,
}));

const MyPageAdminLanding = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const { data: tracks } = useQuery({ queryKey: ['adminTracks'], queryFn: getTracks });
  const { data: activities } = useQuery({ queryKey: ['adminActivities'], queryFn: getActivities });
  const { data: faqs } = useQuery({ queryKey: ['adminFaqs'], queryFn: getFaqs });

  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [trackItems, setTrackItems] = useState<TrackIntroItem[]>([]);
  const [activityItems, setActivityItems] = useState<ActivityIntroItem[]>([]);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 조회된 데이터가 바뀌면(최초 로드, 저장 후 재조회) 화면 편집 상태를 다시 그 값으로 맞춤
  const [syncedTracks, setSyncedTracks] = useState(tracks);
  if (tracks !== syncedTracks) {
    setSyncedTracks(tracks);
    setTrackItems((tracks ?? []).map(trackToLocal));
  }
  const [syncedActivities, setSyncedActivities] = useState(activities);
  if (activities !== syncedActivities) {
    setSyncedActivities(activities);
    setActivityItems((activities ?? []).map(activityToLocal));
  }
  const [syncedFaqs, setSyncedFaqs] = useState(faqs);
  if (faqs !== syncedFaqs) {
    setSyncedFaqs(faqs);
    setFaqItems((faqs ?? []).map(faqToLocal));
  }

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !isAdminRole(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const handleCancel = () => {
    setMetrics(MOCK_METRICS);
    setTrackItems((tracks ?? []).map(trackToLocal));
    setActivityItems((activities ?? []).map(activityToLocal));
    setProjects(MOCK_PROJECTS);
    setFaqItems((faqs ?? []).map(faqToLocal));
    setShowErrors(false);
  };

  const handleSave = async () => {
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
    setIsSaving(true);
    try {
      await Promise.all([
        syncListSection({
          currentItems: trackItems,
          originalItems: tracks ?? [],
          toRequest: trackToRequest,
          create: createTrack,
          update: updateTrack,
          remove: deleteTrack,
        }),
        syncListSection({
          currentItems: activityItems,
          originalItems: activities ?? [],
          toRequest: activityToRequest,
          create: createActivity,
          update: updateActivity,
          remove: deleteActivity,
        }),
        syncListSection({
          currentItems: faqItems,
          originalItems: faqs ?? [],
          toRequest: faqToRequest,
          create: createFaq,
          update: updateFaq,
          remove: deleteFaq,
        }),
      ]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['adminTracks'] }),
        queryClient.invalidateQueries({ queryKey: ['adminActivities'] }),
        queryClient.invalidateQueries({ queryKey: ['adminFaqs'] }),
      ]);
      setToastMessage('변경사항이 저장되었습니다.');
    } catch {
      setToastMessage('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!userProfile || !isAdminRole(userProfile.role)) return null;

  return (
    <>
      <MyPageShell active="admin-landing" isAdmin={isAdminRole(userProfile.role)}>
        <TitleRow>
          <PageTitle>랜딩페이지 관리</PageTitle>
          <ButtonRow>
            <Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
              취소
            </Button>
            <Button size="small" onClick={handleSave} loading={isSaving}>
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
