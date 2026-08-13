import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import PartAttendanceTable from '@mypage/component/PartAttendanceTable';
import WeeklyAttendanceCard, { WeeklyAttendanceRecord } from '@mypage/component/WeeklyAttendanceCard';
import { getUserProfile } from 'src/apis/account';
import {
  AttendanceStatusUpdate,
  MemberAttendanceResponse,
  getPartAttendance,
  updateAttendanceBatch,
} from 'src/apis/attendance';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, isFullAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 회장/관리자 파트 필터 옵션
const ALL_PART = '전체';
const PART_FILTER_OPTIONS = [ALL_PART, '기획디자인', '프론트엔드', '백엔드'];

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

  // 회장/관리자만 파트 필터. 전체면 파라미터 없이 조회.
  const [selectedPart, setSelectedPart] = useState(ALL_PART);
  const partParam = isPresident && selectedPart !== ALL_PART ? selectedPart : undefined;

  const attendanceQueryKey = ['partAttendance', isPresident ? selectedPart : 'own'];
  const { data: partAttendance } = useQuery<MemberAttendanceResponse[]>({
    queryKey: attendanceQueryKey,
    queryFn: () => getPartAttendance(tokenState, partParam),
    enabled: isStaff,
  });

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: (updates: AttendanceStatusUpdate[]) => updateAttendanceBatch(tokenState, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partAttendance'] }),
  });

  const handleSave = (updates: AttendanceStatusUpdate[]) => {
    if (updates.length > 0) saveMutation.mutate(updates);
  };

  if (!userProfile) return null;

  return (
    <MyPageShell active="attendance" isAdmin={isAdminRole(userProfile.role)}>
      {isStaff ? (
        <PartAttendanceTable
          members={partAttendance ?? []}
          partName={isPresident ? undefined : userProfile.partName}
          partFilter={
            isPresident ? { value: selectedPart, options: PART_FILTER_OPTIONS, onChange: setSelectedPart } : undefined
          }
          onSave={handleSave}
          isSaving={saveMutation.isPending}
        />
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
  );
};

MyPageAttendance.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAttendance;

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
