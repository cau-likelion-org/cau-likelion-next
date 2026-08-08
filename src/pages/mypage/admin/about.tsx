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
import TalentSection, { TalentItem, isTalentItemInvalid } from '@mypage/admin/TalentSection';
import CurriculumSection, { CurriculumTrackItems, isCurriculumTracksInvalid } from '@mypage/admin/CurriculumSection';
import RoadmapSection from '@mypage/admin/RoadmapSection';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { CURRICULUM_TRACKS } from '@about/curriculum/data';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 백엔드 API 준비 전까지 사용하는 목 데이터 (실제 소개 페이지 컴포넌트 값과 동기화)
const COMMON_TALENT_TEXT = '열정 있는 사람\n열정 있는 사람\n열정 있는 사람';
const MOCK_TALENT_ITEMS: TalentItem[] = [
  { id: 'common', partName: '공통', content: COMMON_TALENT_TEXT },
  { id: 'plan-design', partName: '기획디자인', content: COMMON_TALENT_TEXT },
  { id: 'frontend', partName: '프론트', content: COMMON_TALENT_TEXT },
  { id: 'backend', partName: '백엔드', content: COMMON_TALENT_TEXT },
];

const MOCK_CURRICULUM_TRACKS: CurriculumTrackItems[] = CURRICULUM_TRACKS.map((track) => ({
  key: track.key,
  label: track.label,
  weeks: track.weeks.map((week) => ({
    id: `${track.key}-${week.key}`,
    week: week.badge,
    title: week.title,
    description: week.content ?? '',
  })),
}));

const MOCK_ROADMAP_IMAGE = 'IMG20260723.png';

const MyPageAdminAbout = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const [talentItems, setTalentItems] = useState(MOCK_TALENT_ITEMS);
  const [curriculumTracks, setCurriculumTracks] = useState(MOCK_CURRICULUM_TRACKS);
  const [roadmapImage, setRoadmapImage] = useState(MOCK_ROADMAP_IMAGE);
  const [toastMessage, setToastMessage] = useState<ReactNode>('');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !userProfile.is_admin) router.push('/mypage');
  }, [userProfile, router]);

  const handleCancel = () => {
    setTalentItems(MOCK_TALENT_ITEMS);
    setCurriculumTracks(MOCK_CURRICULUM_TRACKS);
    setRoadmapImage(MOCK_ROADMAP_IMAGE);
    setShowErrors(false);
  };

  const handleSave = () => {
    const hasError = talentItems.some(isTalentItemInvalid) || isCurriculumTracksInvalid(curriculumTracks);

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
      <MyPageShell active="admin-about" isAdmin={userProfile.is_admin}>
        <TitleRow>
          <PageTitle>소개 페이지 관리</PageTitle>
          <ButtonRow>
            <Button variant="outlined" color="assistive" size="small" onClick={handleCancel}>
              취소
            </Button>
            <Button size="small" onClick={handleSave}>
              저장
            </Button>
          </ButtonRow>
        </TitleRow>
        <TalentSection items={talentItems} onChange={setTalentItems} showErrors={showErrors} />
        <CurriculumSection tracks={curriculumTracks} onChange={setCurriculumTracks} showErrors={showErrors} />
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
