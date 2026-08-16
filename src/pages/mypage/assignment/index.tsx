import { UserProfile } from '@@types/request';
import { AxiosError } from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import MyPageShell from '@mypage/component/MyPageShell';
import MobileUnsupportedModal from '@common/modal/MobileUnsupportedModal';
import PartSelect from '@mypage/component/PartSelect';
import StaffAssignmentCard from '@mypage/component/StaffAssignmentCard';
import WeeklyAssignmentCard, { WeeklyAssignmentGroup } from '@mypage/component/WeeklyAssignmentCard';
import { getGenerations, getUserProfile } from 'src/apis/account';
import {
  AssignmentSummaryWeekGroup,
  AssignmentWeekGroup,
  getMyAssignments,
  getPresidentAssignments,
  getStaffAssignments,
} from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';
import { INACTIVE_MEMBER_NOTICE_KEY, TRACK_OPTIONS } from '@utils/constant';
import { isAdminRole, isFullAdminRole, canManageSitePages } from '@utils/index';
import { IcPlus } from '@assets/svg';
import { Fill, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 마감 기한(ISO) → 2026/09/30
const formatDueDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
};

// 제출 시각(ISO) → 2026/12/12 17:48
const formatSubmittedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${formatDueDate(value)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// 마감이 지났으면 버튼을 숨기고, 한 건도 제출하지 않았으면 제출하기로 보여준다
const resolveActionLabel = (endDate: string, assignments: { submittedAt: string | null }[]) => {
  if (new Date(endDate).getTime() < Date.now()) return undefined;
  return assignments.every((assignment) => !assignment.submittedAt) ? '제출하기' : '수정하기';
};

const ALL_PART = '전체';

const MyPageAssignment = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile, isError: isUserProfileError } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  // 어른사자는 활동 중인 구성원이 아니므로 홈으로 돌려보내고, 홈에서 사유를 토스트로 안내한다
  useEffect(() => {
    if (userProfile?.role !== 'ADULT_LION') return;
    sessionStorage.setItem(INACTIVE_MEMBER_NOTICE_KEY, '1');
    router.replace('/mypage');
  }, [userProfile?.role, router]);

  // 과제 생성 완료 후 넘어오면 토스트 표시
  const [toastMessage, setToastMessage] = useState('');
  useEffect(() => {
    const createdWeek = sessionStorage.getItem('assignmentCreatedWeek');
    if (!createdWeek) return;
    sessionStorage.removeItem('assignmentCreatedWeek');
    const frame = requestAnimationFrame(() => setToastMessage(`${createdWeek}주차 과제가 생성되었습니다.`));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isStaffOrAdmin = !!userProfile && isAdminRole(userProfile.role); // STAFF/PRESIDENT/ADMIN
  const isPresident = !!userProfile && isFullAdminRole(userProfile.role); // 회장/관리자 — 파트별 조회

  // 회장 파트 필터: 현재 활동 기수의 파트 목록(id 포함)을 사용
  const { data: generations } = useQuery({
    queryKey: ['generations'],
    queryFn: getGenerations,
    enabled: isPresident,
  });
  const activeGeneration =
    generations?.find((generation) => generation.status === 'IN_ACTIVITY') ?? generations?.[generations.length - 1];
  // 파트 순서는 응답 순서가 아니라 기획디자인 → 프론트엔드 → 백엔드 고정
  const parts = (activeGeneration?.parts ?? [])
    .filter((part) => part.name !== '기타')
    .sort((a, b) => TRACK_OPTIONS.indexOf(a.name) - TRACK_OPTIONS.indexOf(b.name));
  // 출결관리와 동일하게 '전체'를 맨 앞에 두고 기본 선택으로 쓴다
  const partOptions = [ALL_PART, ...parts.map((part) => part.name)];
  const [selectedPartName, setSelectedPartName] = useState(ALL_PART);
  const currentPartName = selectedPartName;
  const selectedPartId = parts.find((part) => part.name === currentPartName)?.id;

  // 과제 생성·상세보기는 데스크톱 전용이라 모바일에서는 안내 모달을 띄운다
  const [isUnsupportedOpen, setIsUnsupportedOpen] = useState(false);
  const isMobileViewport = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

  const handleCreate = () => {
    if (isMobileViewport()) {
      setIsUnsupportedOpen(true);
      return;
    }
    router.push('/mypage/assignment/create');
  };

  const handleDetail = (week: number) => {
    if (isMobileViewport()) {
      setIsUnsupportedOpen(true);
      return;
    }
    router.push({
      pathname: `/mypage/assignment/status/${week}`,
      query: isPresident && selectedPartId != null ? { partId: selectedPartId } : undefined,
    });
  };

  // 회장: partId로 파트별 조회 / 운영진: 본인 파트 조회
  const {
    data: weekGroups,
    isLoading: isWeekGroupsLoading,
    isError: isWeekGroupsError,
  } = useQuery<AssignmentWeekGroup[]>({
    queryKey: isPresident ? ['presidentAssignments', selectedPartId ?? 'all'] : ['staffAssignments'],
    queryFn: () =>
      isPresident ? getPresidentAssignments(tokenState, selectedPartId) : getStaffAssignments(tokenState),
    enabled: isStaffOrAdmin,
  });

  // 최신 주차가 18이면 18 → 1주차까지 연속으로 표시 (과제 없는 주차는 빈 카드)
  const weeks = (() => {
    const groups = weekGroups ?? [];
    const maxWeek = groups.reduce((max, group) => Math.max(max, group.week), 0);
    const byWeek = new Map(groups.map((group) => [group.week, group.assignments]));
    return Array.from({ length: maxWeek }, (_, index) => {
      const week = maxWeek - index;
      return { week, assignments: byWeek.get(week) ?? [] };
    });
  })();

  // 아기사자: 본인 과제 목록 (마감일이 같은 과제끼리 한 카드로 묶는다)
  const {
    data: myWeekGroups,
    isLoading: isMyWeekGroupsLoading,
    isError: isMyWeekGroupsError,
  } = useQuery<AssignmentSummaryWeekGroup[]>({
    queryKey: ['myAssignments'],
    queryFn: () => getMyAssignments(tokenState),
    enabled: !!userProfile && !isStaffOrAdmin && userProfile.role !== 'ADULT_LION',
  });

  // 한 주차의 과제는 마감일이 모두 같으므로 주차당 카드 하나로 묶는다
  const myGroups: WeeklyAssignmentGroup[] = (myWeekGroups ?? []).map((group) => ({
    week: group.week,
    status: group.weeklyStatus,
    cards:
      group.assignments.length === 0
        ? []
        : [
            {
              id: String(group.week),
              items: group.assignments.map((assignment) => ({
                name: assignment.title,
                status: assignment.status,
                submittedAt: assignment.submittedAt ? formatSubmittedAt(assignment.submittedAt) : undefined,
              })),
              dueDate: formatDueDate(group.assignments[0].endDate),
              actionLabel: resolveActionLabel(group.assignments[0].endDate, group.assignments),
            },
          ],
  }));

  return (
    <>
      <MyPageShell active="assignment" isAdmin={!!userProfile && canManageSitePages(userProfile.role)}>
        {!userProfile || userProfile.role === 'ADULT_LION' ? (
          <PageLoadingGate isError={isUserProfileError} />
        ) : isStaffOrAdmin ? (
          <>
            <Header>
              <TitleRow>
                <SectionTitle>주차별 과제 현황</SectionTitle>
                {isPresident ? (
                  <PartSelect value={currentPartName} options={partOptions} onChange={setSelectedPartName} />
                ) : (
                  userProfile.partName && <TrackName>{userProfile.partName} 파트</TrackName>
                )}
              </TitleRow>
              <CreateButton type="button" onClick={handleCreate}>
                과제 생성
                <IcPlus width={16} height={16} />
              </CreateButton>
            </Header>
            {isWeekGroupsLoading ? (
              <LoadingWrapper>
                <CircularLoading size={32} />
              </LoadingWrapper>
            ) : isWeekGroupsError ? (
              <EmptyState variant="error" />
            ) : weeks.length === 0 ? (
              <EmptyState message="등록된 과제가 없습니다." />
            ) : (
              <List>
                {weeks.map((group) => (
                  <StaffAssignmentCard
                    key={group.week}
                    week={group.week}
                    assignments={group.assignments}
                    onDetail={() => handleDetail(group.week)}
                  />
                ))}
              </List>
            )}
          </>
        ) : (
          <>
            <TitleRow>
              <SectionTitle>주차별 과제 현황</SectionTitle>
              {/* 소속 파트가 해제된 계정은 partName이 비어 오므로 ' 파트'만 남지 않게 감춘다 */}
              {userProfile.partName && <TrackName>{userProfile.partName} 파트</TrackName>}
            </TitleRow>
            {isMyWeekGroupsLoading ? (
              <LoadingWrapper>
                <CircularLoading size={32} />
              </LoadingWrapper>
            ) : isMyWeekGroupsError ? (
              <EmptyState variant="error" />
            ) : myGroups.length === 0 ? (
              <EmptyState message="등록된 과제가 없습니다." />
            ) : (
              <List>
                {myGroups.map((group) => (
                  <WeeklyAssignmentCard key={group.week} group={group} />
                ))}
              </List>
            )}
          </>
        )}
      </MyPageShell>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {isUnsupportedOpen && <MobileUnsupportedModal onClose={() => setIsUnsupportedOpen(false)} />}
    </>
  );
};

MyPageAssignment.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAssignment;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 900px) {
    align-items: flex-start;
  }
`;

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 6px 12px;
  border: 1px solid ${Line.normal};
  border-radius: 8px;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
  ${typographyCss(Typography.body2Normal.medium)}

  /* Figma 모바일: solid/assistive 버튼 (공용 Button의 small+assistive와 동일한 값) */
  @media (max-width: 900px) {
    padding: 7px 14px;
    border: none;
    background-color: ${Fill.normal};
    color: ${Label.neutral};
    ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;

  /* Figma 모바일: 제목 아래 파트명 */
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const SectionTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const TrackName = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  width: 100%;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
