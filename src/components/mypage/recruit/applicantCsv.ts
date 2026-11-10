import { toDateTimeLabel, formatInterviewSlots } from '@utils/index';

import { ApplicantAnswer, ApplicantDetail, SECOND_STEP_QUESTIONS_BY_PART } from './applicantMock';
import { RecruitQuestion } from './mock';

const FIRST_STEP_COLUMNS: { title: string; getValue: (applicant: ApplicantDetail, unitMinutes: number) => string }[] = [
  { title: '학과', getValue: (applicant) => applicant.major ?? '' },
  { title: '학년', getValue: (applicant) => applicant.grade ?? '' },
  { title: '이수 학기', getValue: (applicant) => applicant.semester ?? '' },
  { title: '지원 경로', getValue: (applicant) => applicant.referral ?? '' },
  { title: '지원 파트', getValue: (applicant) => applicant.part ?? '' },
  {
    title: '면접 가능 시간',
    getValue: (applicant, unitMinutes) => formatInterviewSlots(applicant.interviewSlots, unitMinutes),
  },
  { title: '포탈 내정보수정 캡처', getValue: (applicant) => applicant.portalCapture?.url ?? '' },
];

const toAnswerCell = (question: RecruitQuestion, answer?: ApplicantAnswer) => {
  if (!answer) return '';
  if (answer.file) return answer.file.url;
  if (answer.choiceIds) {
    return question.choices
      .filter((choice) => answer.choiceIds?.includes(choice.id))
      .map((choice) => choice.text)
      .join(', ');
  }
  return answer.text ?? '';
};

export const buildApplicantCsvRows = (applicants: ApplicantDetail[], unitMinutes: number) => {
  const partQuestions = Object.entries(SECOND_STEP_QUESTIONS_BY_PART).flatMap(([part, questions]) =>
    questions.map((question) => ({ part, question })),
  );

  const header = [
    '이름',
    '전화번호',
    '이메일',
    '학번',
    '학적',
    ...FIRST_STEP_COLUMNS.map((column) => column.title),
    ...partQuestions.map(({ part, question }) => `[${part}] ${question.title}`),
    '제출 일시',
  ];

  const rows = applicants.map((applicant) => [
    applicant.name,
    applicant.phone,
    applicant.email,
    applicant.studentId ?? '',
    applicant.enrollmentStatus ?? '',
    ...FIRST_STEP_COLUMNS.map((column) => column.getValue(applicant, unitMinutes)),
    ...partQuestions.map(({ part, question }) =>
      applicant.part === part
        ? toAnswerCell(
            question,
            applicant.answers.find((answer) => answer.questionId === question.id),
          )
        : '',
    ),
    applicant.submittedAt ? toDateTimeLabel(new Date(applicant.submittedAt)) : '',
  ]);

  return [header, ...rows];
};
