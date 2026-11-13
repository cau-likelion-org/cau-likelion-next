// 리크루팅 대시보드 API 연동 전까지 사용하는 목업
import { REFERRAL_OPTIONS } from '@recruit/apply/mock';
import { buildRecruitDashboard } from '@utils/recruitDashboard';

import { getApplicants } from '../applicantMock';

interface DashboardRoundMock {
  quotas: Record<string, number>;
  applyStartDate: string;
  applyEndDate: string;
  // 지난 회차는 서류 접수 마감 시점 기준으로 집계한다
  cutoffAt?: string;
}

const ROUNDS: Record<number, DashboardRoundMock> = {
  14: {
    quotas: { '기획·디자인': 4, 프론트엔드: 4, 백엔드: 4 },
    applyStartDate: '2027-03-02',
    applyEndDate: '2027-03-09',
  },
  13: {
    quotas: { '기획·디자인': 4, 프론트엔드: 4, 백엔드: 4 },
    applyStartDate: '2026-03-02',
    applyEndDate: '2026-03-09',
    cutoffAt: '2026-03-09T23:59:59+09:00',
  },
};

export const getRecruitDashboard = async (generation: number) => {
  const round = ROUNDS[generation];
  return {
    ...round,
    dashboard: buildRecruitDashboard(await getApplicants(generation), {
      ...round,
      referralOptions: REFERRAL_OPTIONS,
    }),
  };
};
