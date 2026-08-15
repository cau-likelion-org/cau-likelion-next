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
import EditButton from '@mypage/admin/component/EditButton';
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
import { getRoadmap, addRoadmap } from 'src/apis/roadmap';
import { uploadFile } from 'src/apis/upload';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, canManageSitePages } from '@utils/index';
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

// 로드맵 응답엔 원본 파일명이 없어(S3 URL만 내려옴) URL에서 대신 추출 — 지금 세션에서 새로 선택한
// 파일은 file.name을 그대로 쓰므로 이 fallback은 서버에 이미 저장된 이미지를 불러올 때만 쓰임
const getFileNameFromUrl = (url: string) => {
  try {
    return decodeURIComponent(url.split('/').pop() ?? url);
  } catch {
    return url;
  }
};

interface RoadmapFile {
  url: string;
  name: string;
}

const DEFAULT_ROADMAP_FILE: RoadmapFile = { url: '', name: '' };

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
  const { data: talents } = useQuery({
    queryKey: ['adminTalents'],
    queryFn: () => getTalents(tokenState),
    refetchOnWindowFocus: false,
  });
  const { data: tracks } = useQuery({
    queryKey: ['adminTracks'],
    queryFn: () => getTracks(tokenState),
    refetchOnWindowFocus: false,
  });
  const { data: curriculums } = useQuery({
    queryKey: ['adminCurriculums'],
    queryFn: () => getCurriculums(tokenState),
    refetchOnWindowFocus: false,
  });
  const { data: roadmap } = useQuery({
    queryKey: ['adminRoadmap'],
    queryFn: () => getRoadmap(tokenState),
    refetchOnWindowFocus: false,
  });
  // 조회가 끝나기 전에 편집을 시작하면, 뒤늦게 도착한 최초 조회 결과가 입력 중인 값을 덮어쓸 수 있어
  // 조회가 모두 끝나기 전까지는 수정 버튼을 눌러 편집을 시작할 수 없도록 막음
  const isDataLoaded =
    talents !== undefined && tracks !== undefined && curriculums !== undefined && roadmap !== undefined;

  const [talentItems, setTalentItems] = useState<TalentItem[]>(() => (talents ?? []).map(talentToLocal));
  const [curriculumTracks, setCurriculumTracks] = useState<CurriculumTrackItems[]>(() =>
    buildCurriculumTracks(tracks ?? [], curriculums ?? []),
  );
  const [roadmapFile, setRoadmapFile] = useState<RoadmapFile>(() =>
    roadmap ? { url: roadmap.imageUrl, name: getFileNameFromUrl(roadmap.imageUrl) } : DEFAULT_ROADMAP_FILE,
  );
  const [isUploadingRoadmap, setIsUploadingRoadmap] = useState(false);
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [toastVariant, setToastVariant] = useState<'positive' | 'negative'>('positive');
  const [showErrors, setShowErrors] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
  const [syncedRoadmap, setSyncedRoadmap] = useState(roadmap);
  if (roadmap !== syncedRoadmap) {
    setSyncedRoadmap(roadmap);
    setRoadmapFile(
      roadmap ? { url: roadmap.imageUrl, name: getFileNameFromUrl(roadmap.imageUrl) } : DEFAULT_ROADMAP_FILE,
    );
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
    setRoadmapFile(
      roadmap ? { url: roadmap.imageUrl, name: getFileNameFromUrl(roadmap.imageUrl) } : DEFAULT_ROADMAP_FILE,
    );
    setShowErrors(false);
    setIsEditing(false);
  };

  const handleRoadmapFileSelect = async (file: File) => {
    setIsUploadingRoadmap(true);
    try {
      const { url } = await uploadFile(tokenState, 'ROADMAP', file);
      setRoadmapFile({ url, name: file.name });
    } catch {
      setToastVariant('negative');
      setToastMessage('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploadingRoadmap(false);
    }
  };

  const handleRoadmapClear = () => {
    setRoadmapFile(DEFAULT_ROADMAP_FILE);
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
      const savePromises: Promise<unknown>[] = [
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
      ];
      if (roadmapFile.url && roadmapFile.url !== (roadmap?.imageUrl ?? '')) {
        savePromises.push(addRoadmap(tokenState, roadmapFile.url));
      }
      await Promise.all(savePromises);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['adminTalents'] }),
        queryClient.invalidateQueries({ queryKey: ['adminCurriculums'] }),
        queryClient.invalidateQueries({ queryKey: ['adminRoadmap'] }),
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

  if (!userProfile || !isAdminRole(userProfile.role)) return null;

  return (
    <>
      <MyPageShell active="admin-about" isAdmin={canManageSitePages(userProfile.role)}>
        <TitleRow>
          <PageTitle>소개 페이지 관리</PageTitle>
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
              <EditButton onClick={() => setIsEditing(true)} disabled={!isDataLoaded} />
            )}
          </ButtonRow>
        </TitleRow>
        <TalentSection items={talentItems} onChange={setTalentItems} showErrors={showErrors} disabled={!isEditing} />
        {curriculumTracks.length > 0 && (
          <CurriculumSection
            tracks={curriculumTracks}
            onChange={setCurriculumTracks}
            showErrors={showErrors}
            disabled={!isEditing}
          />
        )}
        <RoadmapSection
          imageUrl={roadmapFile.url}
          fileName={roadmapFile.name}
          onSelectFile={handleRoadmapFileSelect}
          onClear={handleRoadmapClear}
          disabled={!isEditing}
          isUploading={isUploadingRoadmap}
        />
      </MyPageShell>
      <ToastWrapper>
        <Toast variant={toastVariant} text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
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
