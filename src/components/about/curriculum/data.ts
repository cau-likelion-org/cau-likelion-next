export interface CurriculumWeek {
  key: string;
  badge: string;
  title: string;
  content?: string;
}

export interface CurriculumTrack {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  items: string[];
  chips: string[];
  weeks: CurriculumWeek[];
}

const WEEKS: CurriculumWeek[] = [
  {
    key: '0주차',
    badge: '0주차',
    title: '세션 제목',
    content:
      '답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용 답변 내용',
  },
  { key: '1주차', badge: '1주차', title: '세션 제목' },
  { key: '2주차', badge: '2주차', title: '세션 제목' },
  { key: '3주차', badge: '3주차', title: '세션 제목' },
  { key: '공통', badge: '공통', title: '세션 제목' },
];

export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    key: 'planDesign',
    label: '기획디자인',
    title: '기획디자인',
    subtitle: 'Product Manage/Product Design',
    items: ['리스트', '리스트', '리스트'],
    chips: ['Figma', 'UX/UI', 'Prototyping', 'Service design'],
    weeks: WEEKS,
  },
  {
    key: 'frontend',
    label: '프론트',
    title: '프론트',
    subtitle: 'Frontend Development',
    items: ['리스트', '리스트', '리스트'],
    chips: ['React', 'TypeScript', 'Next.js', 'Zustand'],
    weeks: WEEKS,
  },
  {
    key: 'backend',
    label: '백엔드',
    title: '백엔드',
    subtitle: 'Backend Development',
    items: ['리스트', '리스트', '리스트'],
    chips: ['Spring', 'JPA', 'MySQL', 'AWS'],
    weeks: WEEKS,
  },
];
