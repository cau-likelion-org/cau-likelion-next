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
import MyPageShell from '@mypage/component/MyPageShell';
import AssignmentPartSelect from '@mypage/component/AssignmentPartSelect';
import StaffAssignmentCard from '@mypage/component/StaffAssignmentCard';
import WeeklyAssignmentCard, { WeeklyAssignmentGroup } from '@mypage/component/WeeklyAssignmentCard';
import { getGenerations, getUserProfile } from 'src/apis/account';
import { AssignmentWeekGroup, getPresidentAssignments, getStaffAssignments } from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, isFullAdminRole } from '@utils/index';
import { IcPlus } from '@assets/svg';
import { Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 백엔드 API 준비 전까지 사용하는 목 데이터
const MOCK_WEEKLY_ASSIGNMENTS: WeeklyAssignmentGroup[] = [
  {
    week: 18,
    status: 'before',
    cards: [
      {
        items: [
          { name: '연구 프로젝트 1', status: 'approved', submittedAt: '2026/12/12 17:48' },
          { name: '연구 프로젝트 2', status: 'pending', submittedAt: '2026/12/12 17:48' },
          { name: '연구 프로젝트 3', status: 'rejected', submittedAt: '2026/12/12 17:48' },
        ],
        dueDate: '2026/09/30',
        actionLabel: '수정하기',
      },
      {
        items: [
          { name: '연구 프로젝트 A', status: 'before' },
          { name: '연구 프로젝트 3', status: 'rejected', submittedAt: '2026/12/12 17:48' },
        ],
        dueDate: '2026/09/34',
        actionLabel: '수정하기',
      },
      {
        id: '18',
        items: [{ name: '연구 프로젝트 A', status: 'before' }],
        dueDate: '2026/09/35',
        actionLabel: '제출하기',
      },
    ],
  },
  {
    week: 17,
    status: 'late',
    cards: [
      {
        items: [{ name: '연구 프로젝트 A', status: 'approved', submittedAt: '2026/12/12 17:48' }],
        dueDate: '2026/09/30',
      },
    ],
  },
  {
    week: 16,
    status: 'missed',
    cards: [
      {
        items: [{ name: '연구 프로젝트 A', status: 'missed' }],
        dueDate: '2026/09/30',
      },
    ],
  },
  {
    week: 15,
    status: 'done',
    cards: [],
  },
];

const MyPageAssignment = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

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
  const parts = (activeGeneration?.parts ?? []).filter((part) => part.name !== '기타');
  const partOptions = parts.map((part) => part.name);
  const [selectedPartName, setSelectedPartName] = useState('');
  const currentPartName = selectedPartName || partOptions[0] || '';
  const selectedPartId = parts.find((part) => part.name === currentPartName)?.id;

  // 회장: partId로 파트별 조회 / 운영진: 본인 파트 조회
  const {
    data: weekGroups,
    isLoading: isWeekGroupsLoading,
    isError: isWeekGroupsError,
  } = useQuery<AssignmentWeekGroup[]>({
    queryKey: isPresident ? ['presidentAssignments', selectedPartId ?? null] : ['staffAssignments'],
    queryFn: () =>
      isPresident ? getPresidentAssignments(tokenState, selectedPartId as number) : getStaffAssignments(tokenState),
    enabled: isStaffOrAdmin && (!isPresident || selectedPartId != null),
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

  if (!userProfile) return null;

  return (
    <>
      <MyPageShell active="assignment" isAdmin={isAdminRole(userProfile.role)}>
        {isStaffOrAdmin ? (
          <>
            <Header>
              <TitleRow>
                <SectionTitle>주차별 과제 현황</SectionTitle>
                {isPresident ? (
                  <AssignmentPartSelect value={currentPartName} options={partOptions} onChange={setSelectedPartName} />
                ) : (
                  <TrackName>{userProfile.partName} 파트</TrackName>
                )}
              </TitleRow>
              <CreateButton type="button" onClick={() => router.push('/mypage/assignment/create')}>
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
            ) : (
              <List>
                {weeks.map((group) => (
                  <StaffAssignmentCard
                    key={group.week}
                    week={group.week}
                    assignments={group.assignments}
                    onDetail={() =>
                      router.push({
                        pathname: `/mypage/assignment/status/${group.week}`,
                        query: isPresident && selectedPartId != null ? { partId: selectedPartId } : undefined,
                      })
                    }
                  />
                ))}
              </List>
            )}
          </>
        ) : (
          <>
            <TitleRow>
              <SectionTitle>주차별 과제 현황</SectionTitle>
              <TrackName>{userProfile.partName} 파트</TrackName>
            </TitleRow>
            <List>
              {MOCK_WEEKLY_ASSIGNMENTS.map((group) => (
                <WeeklyAssignmentCard key={group.week} group={group} />
              ))}
            </List>
          </>
        )}
      </MyPageShell>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
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
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
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
