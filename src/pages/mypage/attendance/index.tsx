import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import Toast from '@common/toast/Toast';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import PartAttendanceTable from '@mypage/component/PartAttendanceTable';
import WeeklyAttendanceCard, { WeeklyAttendanceRecord } from '@mypage/component/WeeklyAttendanceCard';
import { getGenerations, getUserProfile } from 'src/apis/account';
import {
  AttendanceStatusUpdate,
  MemberAttendanceResponse,
  getAllAttendances,
  getPartAttendance,
  updateAttendanceBatch,
} from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, isFullAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 회장/관리자 파트 필터의 '전체' 옵션 (나머지는 현재 활동 기수의 파트 목록에서 가져옴)
const ALL_PART = '전체';

// 백엔드 API 준비 전까지 사용하는 목 데이터 (아기사자 본인 뷰)
const MOCK_WEEKLY_ATTENDANCE: WeeklyAttendanceRecord[] = [
  { week: 19, date: '2026/12/13', status: 'before' },
  { week: 18, date: '2026/12/12', status: 'present', checkInTime: '18:55:42' },
  { week: 17, date: '2026/12/11', status: 'late', checkInTime: '18:55:42' },
  { week: 16, date: '2026/12/10', status: 'absent', reason: '병원 진료로 인한 결석' },
  { week: 15, date: '2026/12/10', status: 'unauthorized' },
  { week: 14, date: '2026/12/12', status: 'excused', reason: '엘레베이터 고장 이슈' },
];

const MyPageAttendance = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const isStaff = !!userProfile && isAdminRole(userProfile.role);
  const isPresident = !!userProfile && isFullAdminRole(userProfile.role);

  const { data: generations } = useQuery({
    queryKey: ['generations'],
    queryFn: getGenerations,
    enabled: isPresident,
  });
  const activeGeneration =
    generations?.find((generation) => generation.status === 'IN_ACTIVITY') ?? generations?.[generations.length - 1];
  const partOptions = [
    ALL_PART,
    ...(activeGeneration?.parts ?? []).map((part) => part.name).filter((name) => name !== '기타'),
  ];

  // 회장은 전체 파트를 한 번에 받아 파트명으로 필터링, 운영진은 본인 파트만 조회
  const [selectedPart, setSelectedPart] = useState(ALL_PART);

  const attendanceQueryKey = isPresident ? ['allAttendance'] : ['partAttendance'];
  const {
    data: attendance,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
  } = useQuery<MemberAttendanceResponse[]>({
    queryKey: attendanceQueryKey,
    queryFn: () => (isPresident ? getAllAttendances(tokenState) : getPartAttendance(tokenState)),
    enabled: isStaff,
  });

  const members =
    isPresident && selectedPart !== ALL_PART
      ? (attendance ?? []).filter((member) => member.partName === selectedPart)
      : (attendance ?? []);

  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');
  const saveMutation = useMutation({
    mutationFn: (updates: AttendanceStatusUpdate[]) => updateAttendanceBatch(tokenState, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: attendanceQueryKey }),
    onError: () => setErrorMessage('출결 저장에 실패했습니다. 다시 시도해 주세요.'),
  });

  const handleSave = (updates: AttendanceStatusUpdate[]) => {
    if (updates.length === 0) return;
    setErrorMessage('');
    return saveMutation.mutateAsync(updates);
  };

  if (!userProfile) return null;

  return (
    <>
      <ToastWrapper>
        <Toast variant="negative" text={errorMessage} show={!!errorMessage} onHidden={() => setErrorMessage('')} />
      </ToastWrapper>
      <MyPageShell active="attendance" isAdmin={isAdminRole(userProfile.role)}>
        {isStaff ? (
          isAttendanceLoading ? (
            <LoadingWrapper>
              <CircularLoading size={32} />
            </LoadingWrapper>
          ) : isAttendanceError ? (
            <EmptyState variant="error" />
          ) : (
            <PartAttendanceTable
              members={members}
              partName={isPresident ? undefined : userProfile.partName}
              partFilter={
                isPresident ? { value: selectedPart, options: partOptions, onChange: setSelectedPart } : undefined
              }
              onSave={handleSave}
              isSaving={saveMutation.isPending}
            />
          )
        ) : (
          <>
            <SectionTitle>주차별 출결 현황</SectionTitle>
            <List>
              {MOCK_WEEKLY_ATTENDANCE.map((record) => (
                <WeeklyAttendanceCard key={record.week} record={record} />
              ))}
            </List>
          </>
        )}
      </MyPageShell>
    </>
  );
};

MyPageAttendance.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAttendance;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const SectionTitle = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
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
