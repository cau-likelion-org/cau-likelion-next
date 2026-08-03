import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import WeeklyAttendanceCard, { WeeklyAttendanceRecord } from '@mypage/component/WeeklyAttendanceCard';
import useTokenStore from 'src/store/useTokenStore';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 백엔드 API 준비 전까지 사용하는 목 데이터
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

  return (
    <MyPageShell active="attendance">
      <SectionTitle>주차별 출결 현황</SectionTitle>
      <List>
        {MOCK_WEEKLY_ATTENDANCE.map((record) => (
          <WeeklyAttendanceCard key={record.week} record={record} />
        ))}
      </List>
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
