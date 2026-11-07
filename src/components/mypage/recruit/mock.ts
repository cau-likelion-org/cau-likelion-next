import { FaqItem } from '@mypage/component/FaqCardList';

export interface RecruitGenerationSetting {
  generation: string;
  quotas: Record<number, string>;
}

export const RECRUIT_GENERATION_SETTING_MOCK: RecruitGenerationSetting = {
  generation: '',
  quotas: {},
};

export interface RecruitScheduleField {
  key: string;
  label: string;
  date: string;
  time: string;
  caption?: string;
  disallowPast?: boolean;
}

export interface RecruitScheduleItem {
  key: string;
  title: string;
  fields: RecruitScheduleField[];
  isVisible: boolean;
}

export interface RecruitNoticeSetting {
  schedules: RecruitScheduleItem[];
  faqs: FaqItem[];
}

const emptyField = (key: string, label: string, caption?: string): RecruitScheduleField => ({
  key,
  label,
  date: '',
  time: '',
  caption,
});

export const RECRUIT_NOTICE_SETTING_MOCK: RecruitNoticeSetting = {
  schedules: [
    {
      key: 'document',
      title: '서류 접수',
      fields: [
        { ...emptyField('start', '시작 일시'), disallowPast: true },
        emptyField('end', '마감 일시', '마감 일시는 서류 결과 공개 예약 전까지 연장할 수 있습니다.'),
      ],
      isVisible: true,
    },
    { key: 'documentResult', title: '서류 결과 발표', fields: [emptyField('at', '일시')], isVisible: true },
    {
      key: 'interview',
      title: '면접',
      fields: [emptyField('start', '시작 일시'), emptyField('end', '마감 일시')],
      isVisible: true,
    },
    { key: 'finalResult', title: '최종 결과 발표', fields: [emptyField('at', '일시')], isVisible: true },
    { key: 'orientation', title: '오티', fields: [emptyField('at', '일시')], isVisible: true },
  ],
  faqs: [
    {
      id: '1',
      question: 'Q. 모집은 언제 이뤄지나요?',
      answer: '보통 12월에 리크루팅 모집을 시작하고 2월에 최종 발표합니다.',
    },
    { id: '2', question: '', answer: '' },
  ],
};

export interface RecruitInterviewSetting {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  unitMinutes: number;
}

export const RECRUIT_INTERVIEW_SETTING_MOCK: RecruitInterviewSetting = {
  startDate: '2027-03-16',
  endDate: '2027-03-18',
  startTime: '10:00',
  endTime: '18:00',
  unitMinutes: 120,
};

export type RecruitQuestionType = 'LONG_TEXT' | 'LINK' | 'FILE' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';

export interface RecruitQuestionChoice {
  id: string;
  text: string;
}

export interface RecruitQuestion {
  id: string;
  type: RecruitQuestionType | null;
  isRequired: boolean;
  title: string;
  description: string;
  maxLength: string;
  choices: RecruitQuestionChoice[];
}

export interface RecruitPartQuestions {
  partId: number;
  partName: string;
  questions: RecruitQuestion[];
}

export interface RecruitSecondStepSetting {
  parts: RecruitPartQuestions[];
  isLocked: boolean;
}

const question = (id: string, patch: Partial<RecruitQuestion>): RecruitQuestion => ({
  id,
  type: null,
  isRequired: true,
  title: '',
  description: '',
  maxLength: '',
  choices: [],
  ...patch,
});

export const RECRUIT_SECOND_STEP_SETTING_MOCK: RecruitSecondStepSetting = {
  isLocked: false,
  parts: [
    {
      partId: 1,
      partName: '기획·디자인',
      questions: [
        question('1', { type: 'LONG_TEXT', title: '지원 동기를 작성해 주세요.' }),
        question('2', {
          type: 'SINGLE_CHOICE',
          title: '관심있는 분야를 선택해 주세요.',
          choices: [{ id: '2-1', text: '' }],
        }),
        question('3', {}),
      ],
    },
    { partId: 2, partName: '프론트엔드', questions: [] },
    { partId: 3, partName: '백엔드', questions: [] },
  ],
};
