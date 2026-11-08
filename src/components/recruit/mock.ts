// 리쿠르팅 API 연동 전까지 사용하는 목업 데이터
export interface RecruitSchedule {
  label: string;
  period: string;
}

export interface RecruitFaq {
  id: number;
  question: string;
  answer: string;
}

export interface RecruitInfo {
  generation: number;
  stageLabel: string;
  statusLabel: string;
  title: string;
  applyPeriod: string;
  applyButtonLabel: string;
  isApplyOpen: boolean;
  schedules: RecruitSchedule[];
  faqs: RecruitFaq[];
}

export const RECRUIT_MOCK: RecruitInfo = {
  generation: 14,
  stageLabel: '서류 접수',
  statusLabel: '접수 중',
  title: '멋쟁이사자처럼 중앙대학교 14기 아기사자 모집',
  applyPeriod: '서류 접수 2027.03.02(화) 10:00 ~ 2027.03.09(화) 23:59',
  applyButtonLabel: '지원하기 (3/2 10:00 오픈)',
  isApplyOpen: true,
  schedules: [
    { label: '서류 접수', period: '2027.03.02(화) 10:00 ~ 2027.03.09(화) 23:59' },
    { label: '서류 결과 발표', period: '2027.03.13(토) 12:00' },
    { label: '면접', period: '2027.03.16(화) 10:00 ~ 2027.03.19(목) 18:00' },
    { label: '최종 결과 발표', period: '2027.03.21(일) 12:00' },
  ],
  faqs: [
    {
      id: 1,
      question: '개발 경험이 없어도 지원할 수 있나요?',
      answer: '네, 지원할 수 있습니다. 파트별 세션에서 기초부터 함께 학습합니다.',
    },
    {
      id: 2,
      question: '중앙대학교 재학생만 지원할 수 있나요?',
      answer: '중앙대학교 재학생 및 휴학생이라면 학년과 전공에 관계없이 지원할 수 있습니다.',
    },
    {
      id: 3,
      question: '면접은 어떻게 진행되나요?',
      answer: '서류 합격자를 대상으로 대면 면접을 진행하며, 상세 일정은 개별 안내드립니다.',
    },
    {
      id: 4,
      question: '활동 기간은 어떻게 되나요?',
      answer: '3월부터 12월까지 정기 세션과 아이디어톤, 해커톤 등의 행사에 참여합니다.',
    },
  ],
};
