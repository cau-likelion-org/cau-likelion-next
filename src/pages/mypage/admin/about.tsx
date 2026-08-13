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
import TalentSection, { TalentItem, isTalentItemsInvalid } from '@mypage/admin/TalentSection';
import CurriculumSection, {
  CurriculumTrackItems,
  CurriculumWeekItem,
  isCurriculumTracksInvalid,
} from '@mypage/admin/CurriculumSection';
import RoadmapSection from '@mypage/admin/RoadmapSection';
import { syncListSection } from '@mypage/admin/utils';
import { getUserProfile } from 'src/apis/account';
import { getTracks, TrackResponse } from 'src/apis/track';
import { getTalents, createTalent, updateTalent, deleteTalent, TalentResponse } from 'src/apis/talent';
import {
  getCurriculums,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  CurriculumResponse,
  CurriculumRequest,
} from 'src/apis/curriculum';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const talentToLocal = (talent: TalentResponse): TalentItem => ({
  id: String(talent.id),
  partName: talent.partName,
  content: talent.content,
});
const talentToRequest = (item: TalentItem) => ({ partName: item.partName, content: item.content });

const buildCurriculumTracks = (tracks: TrackResponse[], curriculums: CurriculumResponse[]): CurriculumTrackItems[] =>
  tracks.map((track) => ({
    key: String(track.id),
    label: track.koName,
    weeks: curriculums
      .filter((curriculum) => curriculum.trackId === track.id)
      .map((curriculum) => ({
        id: String(curriculum.id),
        week: curriculum.week,
        title: curriculum.title,
        description: curriculum.description,
      })),
  }));

interface CurriculumWeekWithTrack extends CurriculumWeekItem {
  trackId: number;
}

const flattenCurriculumTracks = (tracks: CurriculumTrackItems[]): CurriculumWeekWithTrack[] =>
  tracks.flatMap((track) => track.weeks.map((week) => ({ ...week, trackId: Number(track.key) })));

const curriculumWeekToLocal = (curriculum: CurriculumResponse): CurriculumWeekWithTrack => ({
  id: String(curriculum.id),
  week: curriculum.week,
  title: curriculum.title,
  description: curriculum.description,
  trackId: curriculum.trackId,
});
const curriculumWeekToRequest = (item: CurriculumWeekWithTrack): CurriculumRequest => ({
  trackId: item.trackId,
  week: item.week,
  title: item.title,
  description: item.description,
});

// 로드맵 이미지는 아직 백엔드 API가 없어 목 데이터 유지
const MOCK_ROADMAP_IMAGE = 'IMG20260723.png';

const MyPageAdminAbout = () => {
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

  // 편집 화면이라 창 포커스 시 백그라운드 재조회로 입력 중인 값이 덮어써지지 않도록 자동 재조회를 끔
  const { data: talents } = useQuery({ queryKey: ['adminTalents'], queryFn: getTalents, refetchOnWindowFocus: false });
  const { data: tracks } = useQuery({ queryKey: ['adminTracks'], queryFn: getTracks, refetchOnWindowFocus: false });
  const { data: curriculums } = useQuery({
    queryKey: ['adminCurriculums'],
    queryFn: getCurriculums,
    refetchOnWindowFocus: false,
  });

  const [talentItems, setTalentItems] = useState<TalentItem[]>([]);
  const [curriculumTracks, setCurriculumTracks] = useState<CurriculumTrackItems[]>([]);
  const [roadmapImage, setRoadmapImage] = useState(MOCK_ROADMAP_IMAGE);
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 조회된 데이터가 바뀌면(최초 로드, 저장 후 재조회) 화면 편집 상태를 다시 그 값으로 맞춤
  const [syncedTalents, setSyncedTalents] = useState(talents);
  if (talents !== syncedTalents) {
    setSyncedTalents(talents);
    setTalentItems((talents ?? []).map(talentToLocal));
  }
  const [syncedTracks, setSyncedTracks] = useState(tracks);
  const [syncedCurriculums, setSyncedCurriculums] = useState(curriculums);
  if (tracks !== syncedTracks || curriculums !== syncedCurriculums) {
    setSyncedTracks(tracks);
    setSyncedCurriculums(curriculums);
    setCurriculumTracks(buildCurriculumTracks(tracks ?? [], curriculums ?? []));
  }

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !isAdminRole(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const handleCancel = () => {
    setTalentItems((talents ?? []).map(talentToLocal));
    setCurriculumTracks(buildCurriculumTracks(tracks ?? [], curriculums ?? []));
    setRoadmapImage(MOCK_ROADMAP_IMAGE);
    setShowErrors(false);
  };

  const handleSave = async () => {
    const hasError = isTalentItemsInvalid(talentItems) || isCurriculumTracksInvalid(curriculumTracks);

    if (hasError) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setIsSaving(true);
    try {
      await Promise.all([
        syncListSection({
          currentItems: talentItems,
          originalItems: talents ?? [],
          toLocal: talentToLocal,
          toRequest: talentToRequest,
          create: (form) => createTalent(tokenState, form),
          update: (id, form) => updateTalent(tokenState, id, form),
          remove: (id) => deleteTalent(tokenState, id),
        }),
        syncListSection({
          currentItems: flattenCurriculumTracks(curriculumTracks),
          originalItems: curriculums ?? [],
          toLocal: curriculumWeekToLocal,
          toRequest: curriculumWeekToRequest,
          create: (form) => createCurriculum(tokenState, form),
          update: (id, form) => updateCurriculum(tokenState, id, form),
          remove: (id) => deleteCurriculum(tokenState, id),
        }),
      ]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['adminTalents'] }),
        queryClient.invalidateQueries({ queryKey: ['adminCurriculums'] }),
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
      <MyPageShell active="admin-about" isAdmin={isAdminRole(userProfile.role)}>
        <TitleRow>
          <PageTitle>소개 페이지 관리</PageTitle>
          <ButtonRow>
            <Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
              취소
            </Button>
            <Button size="small" onClick={handleSave} loading={isSaving}>
              저장
            </Button>
          </ButtonRow>
        </TitleRow>
        <TalentSection items={talentItems} onChange={setTalentItems} showErrors={showErrors} />
        {curriculumTracks.length > 0 && (
          <CurriculumSection tracks={curriculumTracks} onChange={setCurriculumTracks} showErrors={showErrors} />
        )}
        <RoadmapSection imageName={roadmapImage} onChange={setRoadmapImage} />
      </MyPageShell>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
    </>
  );
};

MyPageAdminAbout.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAdminAbout;

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
