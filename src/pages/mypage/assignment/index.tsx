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
  AssignmentSummary,
  AssignmentSummaryWeekGroup,
  AssignmentWeekGroup,
  canSubmitAssignment,
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
import { XS_MEDIA_QUERY, media } from '@utils/constant/breakpoint';

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

const groupByDeadline = (assignments: AssignmentSummary[]) => {
  const buckets = new Map<string, AssignmentSummary[]>();
  assignments.forEach((assignment) => {
    const bucket = buckets.get(assignment.endDate);
    if (bucket) bucket.push(assignment);
    else buckets.set(assignment.endDate, [assignment]);
  });
  return [...buckets.entries()].sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());
};

const resolveActionLabel = (assignments: AssignmentSummary[]) => {
  const submittable = assignments.filter((assignment) => canSubmitAssignment(assignment.status, assignment.endDate));
  if (submittable.length === 0) return undefined;
  return submittable.every((assignment) => !assignment.submittedAt) ? '제출하기' : '수정하기';
};

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

  const partOptions = parts.map((part) => part.name);
  const [selectedPartName, setSelectedPartName] = useState('');
  const currentPartName = selectedPartName || partOptions[0] || '';
  const selectedPartId = parts.find((part) => part.name === currentPartName)?.id;

  // 과제 생성·상세보기는 데스크톱 전용이라 모바일에서는 안내 모달을 띄운다
  const [isUnsupportedOpen, setIsUnsupportedOpen] = useState(false);
  const isMobileViewport = () => typeof window !== 'undefined' && window.matchMedia(XS_MEDIA_QUERY).matches;

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
  const presidentPartId = isPresident ? selectedPartId : undefined;
  const {
    data: weekGroups,
    isLoading: isWeekGroupsLoading,
    isError: isWeekGroupsError,
  } = useQuery<AssignmentWeekGroup[]>({
    queryKey: isPresident ? ['presidentAssignments', presidentPartId] : ['staffAssignments'],
    queryFn: () =>
      presidentPartId != null ? getPresidentAssignments(tokenState, presidentPartId) : getStaffAssignments(tokenState),
    enabled: isStaffOrAdmin && (!isPresident || presidentPartId != null),
  });

  const isPartResolving = isPresident && presidentPartId == null && !generations;

  const weeks = [...(weekGroups ?? [])].sort((a, b) => b.week - a.week);

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

  // 아기사자: 마감일이 같은 과제는 한 카드, 다르면 마감일 순으로 카드를 나눈다
  const myGroups: WeeklyAssignmentGroup[] = (myWeekGroups ?? []).map((group) => ({
    week: group.week,
    status: group.weeklyStatus,
    cards: groupByDeadline(group.assignments).map(([endDate, assignments]) => ({
      id: String(group.week),
      assignmentIds: assignments.map((assignment) => assignment.assignmentId),
      items: assignments.map((assignment) => ({
        name: assignment.title,
        status: assignment.status,
        submittedAt: assignment.submittedAt ? formatSubmittedAt(assignment.submittedAt) : undefined,
      })),
      dueDate: formatDueDate(endDate),
      actionLabel: resolveActionLabel(assignments),
    })),
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
            {isWeekGroupsLoading || isPartResolving ? (
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

  ${media.xs} {
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

  ${media.xs} {
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

  ${media.xs} {
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
