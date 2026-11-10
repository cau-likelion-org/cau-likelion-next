// 전형 결과 관리 API 연동 전까지 사용하는 목업
import { ApplicantDetail, ScreeningResult, getApplicants } from '../applicantMock';

export type ScreeningStage = 'DOCUMENT' | 'FINAL';
export type PublishStatus = 'EDITING' | 'RESERVED' | 'PUBLISHED';
export type TemplateKey = 'DOCUMENT_PASS' | 'DOCUMENT_FAIL' | 'FINAL_PASS' | 'FINAL_FAIL';

export interface StagePublish {
  status: PublishStatus;
  publishAt?: string;
  resultEndDate?: string;
}

export interface InterviewInfo {
  date: string;
  time: string;
  place: string;
}

export interface ScreeningData {
  applicants: ApplicantDetail[];
  publish: Record<ScreeningStage, StagePublish>;
  templates: Record<TemplateKey, string>;
  savedTemplates: TemplateKey[];
  interviews: Record<number, InterviewInfo>;
}

// 결과 확인 종료일 제한(모집 종료일로부터 3개월)의 기준일
export const RECRUIT_END_DATE = '2027-03-21';

// 화면 확인용: 'PUBLISHED'로 바꾸면 서류 결과가 공개된 상태(면접 전형 입력 가능)로 볼 수 있다
const MOCK_DOCUMENT_STATUS: PublishStatus = 'EDITING';

const createDefaultTemplates = (generation: number): Record<TemplateKey, string> => {
  const club = `멋쟁이사자처럼 중앙대학교 ${generation}기`;
  return {
    DOCUMENT_PASS: `{이름}님, 안녕하세요.\n${club} 서류 전형에 합격하셨음을 알려드립니다.\n\n면접 일시 : {면접 일시}\n면접 대기 장소 : {면접 대기 장소}\n\n면접 20분 전까지 대기 장소에 도착해 주세요.\n면접에서 뵙겠습니다.`,
    DOCUMENT_FAIL: `{이름}님, 안녕하세요.\n${club}에 관심을 가지고 지원해 주셔서 감사합니다.\n\n아쉽게도 이번 서류 전형에서는 함께하지 못하게 되었습니다.\n보내주신 관심에 다시 한번 감사드립니다.`,
    FINAL_PASS: `{이름}님, 축하드립니다.\n${club} 아기사자로 최종 합격하셨습니다.\n\n오리엔테이션 일정은 추후 개별 안내드릴 예정입니다.\n앞으로 함께할 1년을 기대하겠습니다.`,
    FINAL_FAIL: `{이름}님, 안녕하세요.\n${club} 면접에 참여해 주셔서 감사합니다.\n\n아쉽게도 이번에는 함께하지 못하게 되었습니다.\n보내주신 관심과 시간에 다시 한번 감사드립니다.`,
  };
};

interface GenerationStore {
  publish: Record<ScreeningStage, StagePublish>;
  templates: Record<TemplateKey, string>;
  savedTemplates: TemplateKey[];
  interviews: Record<number, InterviewInfo>;
}

const stores: Record<number, GenerationStore> = {};

const getStore = (generation: number, applicants: ApplicantDetail[]) => {
  if (!stores[generation]) {
    const passed = applicants.filter((applicant) => applicant.documentResult === 'PASS');
    stores[generation] = {
      publish: {
        DOCUMENT: { status: MOCK_DOCUMENT_STATUS, publishAt: '2027-03-13T12:00' },
        FINAL: { status: 'EDITING' },
      },
      templates: createDefaultTemplates(generation),
      savedTemplates: ['DOCUMENT_PASS'],
      interviews: Object.fromEntries(
        passed
          .slice(0, -1)
          .map((applicant, index) => [
            applicant.id,
            { date: '2027-03-16', time: index === 1 ? '10:00' : '14:00', place: '310관 B101호' },
          ]),
      ),
    };
  }
  return stores[generation];
};

const delay = () => new Promise((resolve) => setTimeout(resolve, 300));

const isSubmitted = (applicant: ApplicantDetail) =>
  applicant.submissionStatus === 'ON_TIME' || applicant.submissionStatus === 'LATE';

export const getScreeningData = async (generation: number): Promise<ScreeningData> => {
  const applicants = (await getApplicants(generation)).filter(isSubmitted);
  const store = getStore(generation, applicants);
  return {
    applicants,
    publish: store.publish,
    templates: store.templates,
    savedTemplates: store.savedTemplates,
    interviews: store.interviews,
  };
};

export const saveScreeningResults = async ({
  generation,
  stage,
  results,
}: {
  generation: number;
  stage: ScreeningStage;
  results: Record<number, ScreeningResult>;
}) => {
  await delay();
  const applicants = await getApplicants(generation);
  Object.entries(results).forEach(([id, result]) => {
    const applicant = applicants.find((item) => item.id === Number(id));
    if (!applicant) return;
    if (stage === 'FINAL') {
      applicant.interviewResult = result;
      return;
    }
    if (applicant.documentResult === 'PASS' && result !== 'PASS') applicant.interviewResult = undefined;
    applicant.documentResult = result;
  });
};

export const saveInterviewInfos = async ({
  generation,
  infos,
}: {
  generation: number;
  infos: Record<number, InterviewInfo>;
}) => {
  await delay();
  Object.assign(stores[generation].interviews, infos);
};

export const saveTemplates = async ({
  generation,
  templates,
}: {
  generation: number;
  templates: Partial<Record<TemplateKey, string>>;
}) => {
  await delay();
  const store = stores[generation];
  Object.assign(store.templates, templates);
  const keys = Object.keys(templates) as TemplateKey[];
  store.savedTemplates = Array.from(new Set([...store.savedTemplates, ...keys]));
};

export const reservePublish = async ({
  generation,
  stage,
  publishAt,
  resultEndDate,
}: {
  generation: number;
  stage: ScreeningStage;
  publishAt: string;
  resultEndDate?: string;
}) => {
  await delay();
  stores[generation].publish[stage] = { status: 'RESERVED', publishAt, resultEndDate };
};

export const cancelReservation = async ({ generation, stage }: { generation: number; stage: ScreeningStage }) => {
  await delay();
  stores[generation].publish[stage] = { status: 'EDITING' };
};
