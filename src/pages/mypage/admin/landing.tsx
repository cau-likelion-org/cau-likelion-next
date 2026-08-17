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
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import IntroduceSection, { LandingMetrics, isMetricsInvalid } from '@mypage/admin/IntroduceSection';
import TrackSection, { TrackIntroItem, isTrackItemInvalid } from '@mypage/admin/TrackSection';
import ActivitySection, {
  ActivityIntroItem,
  isActivityItemInvalid,
  PAGE_NAVIGATION_LABEL,
  PAGE_NAVIGATION_BY_LABEL,
} from '@mypage/admin/ActivitySection';
import ProjectSection, {
  FeaturedProject,
  isProjectSelectionInvalid,
  MIN_EXPOSED_PROJECT_COUNT,
} from '@mypage/admin/ProjectSection';
import FAQSection, { FaqItem, isFaqItemInvalid } from '@mypage/admin/FAQSection';
import EditButton from '@mypage/admin/component/EditButton';
import { syncListSection } from '@mypage/admin/utils';
import { getUserProfile } from 'src/apis/account';
import { getTracks, createTrack, updateTrack, deleteTrack, TrackResponse } from 'src/apis/track';
import { getActivities, createActivity, updateActivity, deleteActivity, ActivityResponse } from 'src/apis/activity';
import { getFaqs, createFaq, updateFaq, deleteFaq, FaqResponse } from 'src/apis/faq';
import { getIntroduce, updateIntroduce, IntroduceResponse } from 'src/apis/introduce';
import { getAdminProjectList, updateProjectExposure, AdminProjectListItem } from 'src/apis/project';
import { uploadFile } from 'src/apis/upload';
import { PROJECT_CATEGORY_LABEL } from '@home/project/component/ProjectCard';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, canManageSitePages } from '@utils/index';
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

const DEFAULT_INTRODUCE_METRICS: LandingMetrics = { generationCount: '', graduateCount: '', projectCount: '' };
const introduceToLocal = (introduce: IntroduceResponse): LandingMetrics => ({
  generationCount: introduce.cumulativeGenerations,
  graduateCount: introduce.cumulativeGraduates,
  projectCount: introduce.cumulativeProjects,
});
const introduceToRequest = (item: LandingMetrics) => ({
  cumulativeGenerations: item.generationCount,
  cumulativeGraduates: item.graduateCount,
  cumulativeProjects: item.projectCount,
});

const projectToLocal = (project: AdminProjectListItem): FeaturedProject => ({
  id: String(project.id),
  name: project.title,
  generation: `${project.generationNumber}기`,
  category: PROJECT_CATEGORY_LABEL[project.category],
  selected: project.isExposed,
  thumbnail: project.thumbnail,
});

const MyPageAdminLanding = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userProfile, isError: isUserProfileError } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  // 편집 화면이라 창 포커스 시 백그라운드 재조회로 입력 중인 값이 덮어써지지 않도록 자동 재조회를 끔
  const { data: introduce, isError: isIntroduceError } = useQuery({
    queryKey: ['adminIntroduce'],
    queryFn: () => getIntroduce(tokenState),
    refetchOnWindowFocus: false,
  });
  const { data: tracks, isError: isTracksError } = useQuery({
    queryKey: ['adminTracks'],
    queryFn: () => getTracks(tokenState),
    refetchOnWindowFocus: false,
  });
  const { data: activities, isError: isActivitiesError } = useQuery({
    queryKey: ['adminActivities'],
    queryFn: () => getActivities(tokenState),
    refetchOnWindowFocus: false,
  });
  const { data: projects, isError: isProjectsError } = useQuery({
    queryKey: ['adminProjects'],
    queryFn: getAdminProjectList,
    refetchOnWindowFocus: false,
  });
  const { data: faqs, isError: isFaqsError } = useQuery({
    queryKey: ['adminFaqs'],
    queryFn: () => getFaqs(tokenState),
    refetchOnWindowFocus: false,
  });
  const isDataLoaded =
    introduce !== undefined &&
    tracks !== undefined &&
    activities !== undefined &&
    projects !== undefined &&
    faqs !== undefined;
  const isDataError = isIntroduceError || isTracksError || isActivitiesError || isProjectsError || isFaqsError;
  const dataLoadProgress =
    [introduce, tracks, activities, projects, faqs].filter((item) => item !== undefined).length / 5;

  const [introduceMetrics, setIntroduceMetrics] = useState(() =>
    introduce ? introduceToLocal(introduce) : DEFAULT_INTRODUCE_METRICS,
  );
  const [trackItems, setTrackItems] = useState<TrackIntroItem[]>(() => (tracks ?? []).map(trackToLocal));
  const [activityItems, setActivityItems] = useState<ActivityIntroItem[]>(() =>
    (activities ?? []).map(activityToLocal),
  );
  const [uploadingActivityIds, setUploadingActivityIds] = useState<string[]>([]);
  const [projectItems, setProjectItems] = useState<FeaturedProject[]>(() => (projects ?? []).map(projectToLocal));
  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => (faqs ?? []).map(faqToLocal));
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [toastVariant, setToastVariant] = useState<'positive' | 'negative'>('positive');
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // 조회된 데이터가 바뀌면(최초 로드, 저장 후 재조회) 화면 편집 상태를 다시 그 값으로 맞춤
  const [syncedIntroduce, setSyncedIntroduce] = useState(introduce);
  if (introduce !== syncedIntroduce) {
    setSyncedIntroduce(introduce);
    if (!isEditing) {
      setIntroduceMetrics(introduce ? introduceToLocal(introduce) : DEFAULT_INTRODUCE_METRICS);
    }
  }
  const [syncedTracks, setSyncedTracks] = useState(tracks);
  if (tracks !== syncedTracks) {
    setSyncedTracks(tracks);
    if (!isEditing) {
      setTrackItems((tracks ?? []).map(trackToLocal));
    }
  }
  const [syncedActivities, setSyncedActivities] = useState(activities);
  if (activities !== syncedActivities) {
    setSyncedActivities(activities);
    if (!isEditing) {
      setActivityItems((activities ?? []).map(activityToLocal));
    }
  }
  const [syncedProjects, setSyncedProjects] = useState(projects);
  if (projects !== syncedProjects) {
    setSyncedProjects(projects);
    if (!isEditing) {
      setProjectItems((projects ?? []).map(projectToLocal));
    }
  }
  const [syncedFaqs, setSyncedFaqs] = useState(faqs);
  if (faqs !== syncedFaqs) {
    setSyncedFaqs(faqs);
    if (!isEditing) {
      setFaqItems((faqs ?? []).map(faqToLocal));
    }
  }

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !isAdminRole(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const handleCancel = () => {
    setIntroduceMetrics(introduce ? introduceToLocal(introduce) : DEFAULT_INTRODUCE_METRICS);
    setTrackItems((tracks ?? []).map(trackToLocal));
    setActivityItems((activities ?? []).map(activityToLocal));
    setProjectItems((projects ?? []).map(projectToLocal));
    setFaqItems((faqs ?? []).map(faqToLocal));
    setShowErrors(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const hasError =
      isMetricsInvalid(introduceMetrics) ||
      trackItems.some(isTrackItemInvalid) ||
      activityItems.some(isActivityItemInvalid) ||
      isProjectSelectionInvalid(projectItems) ||
      faqItems.some(isFaqItemInvalid);

    if (hasError) {
      setShowErrors(true);
      if (isProjectSelectionInvalid(projectItems)) {
        setToastVariant('negative');
        setToastMessage(`노출 프로젝트는 최소 ${MIN_EXPOSED_PROJECT_COUNT}개 이상 선택해 주세요.`);
      }
      return;
    }
    setShowErrors(false);
    setIsSaving(true);
    try {
      await Promise.all([
        updateIntroduce(tokenState, introduceToRequest(introduceMetrics)),
        syncListSection({
          currentItems: trackItems,
          originalItems: tracks ?? [],
          toLocal: trackToLocal,
          toRequest: trackToRequest,
          create: (form) => createTrack(tokenState, form),
          update: (id, form) => updateTrack(tokenState, id, form),
          remove: (id) => deleteTrack(tokenState, id),
        }),
        syncListSection({
          currentItems: activityItems,
          originalItems: activities ?? [],
          toLocal: activityToLocal,
          toRequest: activityToRequest,
          create: (form) => createActivity(tokenState, form),
          update: (id, form) => updateActivity(tokenState, id, form),
          remove: (id) => deleteActivity(tokenState, id),
        }),
        updateProjectExposure(
          tokenState,
          projectItems.filter((project) => project.selected).map((project) => Number(project.id)),
        ),
        syncListSection({
          currentItems: faqItems,
          originalItems: faqs ?? [],
          toLocal: faqToLocal,
          toRequest: faqToRequest,
          create: (form) => createFaq(tokenState, form),
          update: (id, form) => updateFaq(tokenState, id, form),
          remove: (id) => deleteFaq(tokenState, id),
        }),
      ]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['adminIntroduce'] }),
        queryClient.invalidateQueries({ queryKey: ['adminTracks'] }),
        queryClient.invalidateQueries({ queryKey: ['adminActivities'] }),
        queryClient.invalidateQueries({ queryKey: ['adminProjects'] }),
        queryClient.invalidateQueries({ queryKey: ['adminFaqs'] }),
      ]);
      setToastVariant('positive');
      setToastMessage('변경사항이 저장되었습니다.');
      setIsEditing(false);
    } catch {
      setToastVariant('negative');
      setToastMessage('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivityImageSelect = async (id: string, file: File) => {
    setUploadingActivityIds((prev) => [...prev, id]);
    try {
      const { url } = await uploadFile(tokenState, 'ACTIVITY', file);
      setActivityItems((prev) => prev.map((item) => (item.id === id ? { ...item, imageName: url } : item)));
    } catch {
      setToastVariant('negative');
      setToastMessage('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploadingActivityIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const isAuthorized = !!userProfile && isAdminRole(userProfile.role);

  return (
    <>
      <MyPageShell active="admin-landing" isAdmin={!!userProfile && canManageSitePages(userProfile.role)}>
        {!isAuthorized ? (
          <PageLoadingGate isError={isUserProfileError} />
        ) : (
          <>
            <TitleRow>
              <PageTitle>랜딩페이지 관리</PageTitle>
              <ButtonRow>
                {isEditing ? (
                  <>
                    <Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
                      취소
                    </Button>
                    <Button size="small" onClick={handleSave} loading={isSaving}>
                      저장
                    </Button>
                  </>
                ) : (
                  <EditButton onClick={() => setIsEditing(true)} />
                )}
              </ButtonRow>
            </TitleRow>
            {isDataError ? (
              <EmptyState variant="error" />
            ) : !isDataLoaded ? (
              <LoadingWrapper>
                <LinearLoading progress={dataLoadProgress} />
              </LoadingWrapper>
            ) : (
              <>
                <IntroduceSection
                  metrics={introduceMetrics}
                  onChange={setIntroduceMetrics}
                  showErrors={showErrors}
                  disabled={!isEditing}
                />
                <TrackSection
                  items={trackItems}
                  onChange={setTrackItems}
                  showErrors={showErrors}
                  disabled={!isEditing}
                />
                <ActivitySection
                  items={activityItems}
                  onChange={setActivityItems}
                  showErrors={showErrors}
                  disabled={!isEditing}
                  uploadingIds={uploadingActivityIds}
                  onUploadImage={handleActivityImageSelect}
                />
                <ProjectSection
                  projects={projectItems}
                  onChange={setProjectItems}
                  showErrors={showErrors}
                  disabled={!isEditing}
                />
                <FAQSection items={faqItems} onChange={setFaqItems} showErrors={showErrors} disabled={!isEditing} />
              </>
            )}
          </>
        )}
      </MyPageShell>
      <ToastWrapper>
        <Toast variant={toastVariant} text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
