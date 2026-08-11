import { UserProfile } from '@@types/request';
import { AxiosError } from 'axios';
import { ReactElement, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import WeeklyAssignmentCard, { WeeklyAssignmentGroup } from '@mypage/component/WeeklyAssignmentCard';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import { Label } from '@utils/constant/color';
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

  if (!userProfile) return null;

  return (
    <MyPageShell active="assignment" isAdmin={isAdminRole(userProfile.role)}>
      <TitleRow>
        <SectionTitle>주차별 과제 현황</SectionTitle>
        <TrackName>{userProfile.partName} 파트</TrackName>
      </TitleRow>
      <List>
        {MOCK_WEEKLY_ASSIGNMENTS.map((group) => (
          <WeeklyAssignmentCard key={group.week} group={group} />
        ))}
      </List>
    </MyPageShell>
  );
};

MyPageAssignment.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAssignment;

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
