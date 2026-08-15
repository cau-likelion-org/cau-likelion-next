import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import Toast from '@common/toast/Toast';
import PartAttendanceTable from '@mypage/component/PartAttendanceTable';
import WeeklyAttendanceCard, {
  WeeklyAttendanceRecord,
  WeeklyAttendanceStatus,
} from '@mypage/component/WeeklyAttendanceCard';
import { getGenerations, getUserProfile } from 'src/apis/account';
import {
  AttendanceStatus,
  AttendanceStatusResponse,
  AttendanceStatusUpdate,
  MemberAttendanceResponse,
  getAllAttendances,
  getMyAttendances,
  getPartAttendance,
  updateAttendanceBatch,
} from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { INACTIVE_MEMBER_NOTICE_KEY } from '@utils/constant';
import { isAdminRole, isFullAdminRole, canManageSitePages } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 회장/관리자 파트 필터의 '전체' 옵션 (나머지는 현재 활동 기수의 파트 목록에서 가져옴)
const ALL_PART = '전체';

const CARD_STATUS: Record<AttendanceStatus, WeeklyAttendanceStatus> = {
  BEFORE: 'before',
  PRESENT: 'present',
  LATE: 'late',
  ABSENT: 'absent',
  UNAUTHORIZED_ABSENT: 'unauthorized',
  EXCUSED: 'excused',
};

// 서버 응답(YYYY-MM-DD / ISO date-time)을 카드 표기 형식으로 바꾼다
const toWeeklyRecord = (record: AttendanceStatusResponse): WeeklyAttendanceRecord => ({
  week: record.weekNumber,
  date: record.date.replace(/-/g, '/'),
  status: CARD_STATUS[record.status],
  checkInTime: record.checkedAt ? record.checkedAt.slice(11, 19) : undefined,
  reason: record.reason || undefined,
});

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

  // 어른사자는 활동 중인 구성원이 아니므로 홈으로 돌려보내고, 홈에서 사유를 토스트로 안내한다
  useEffect(() => {
    if (userProfile?.role !== 'ADULT_LION') return;
    sessionStorage.setItem(INACTIVE_MEMBER_NOTICE_KEY, '1');
    router.replace('/mypage');
  }, [userProfile?.role, router]);

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
  const { data: attendance } = useQuery<MemberAttendanceResponse[]>({
    queryKey: attendanceQueryKey,
    queryFn: () => (isPresident ? getAllAttendances(tokenState) : getPartAttendance(tokenState)),
    enabled: isStaff,
  });

  // 아기사자 본인 주차별 출결
  const { data: myAttendances } = useQuery<AttendanceStatusResponse[]>({
    queryKey: ['myAttendance'],
    queryFn: () => getMyAttendances(tokenState),
    enabled: !!userProfile && !isStaff && userProfile.role !== 'ADULT_LION',
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
      <MyPageShell active="attendance" isAdmin={canManageSitePages(userProfile.role)}>
        {isStaff ? (
          <PartAttendanceTable
            members={members}
            partName={isPresident ? undefined : userProfile.partName}
            partFilter={
              isPresident ? { value: selectedPart, options: partOptions, onChange: setSelectedPart } : undefined
            }
            onSave={handleSave}
            isSaving={saveMutation.isPending}
          />
        ) : (
          <>
            <SectionTitle>주차별 출결 현황</SectionTitle>
            <List>
              {(myAttendances ?? []).map(toWeeklyRecord).map((record) => (
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
