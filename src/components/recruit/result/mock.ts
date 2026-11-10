// 결과 확인 API 연동 전까지 사용하는 목업
export type RecruitResult =
  | { stage: 'DOCUMENT'; isPassed: true; name: string; interviewAt: string; interviewPlace: string }
  | { stage: 'DOCUMENT' | 'FINAL'; isPassed: boolean; name: string };

// 결과 화면 확인용: 아래 이메일로 로그인하면 해당 결과로, 그 외 제출 완료 계정은 서류 합격으로 응답한다
const MOCK_RESULTS: Record<string, RecruitResult> = {
  'document-fail@example.com': { stage: 'DOCUMENT', isPassed: false, name: '홍길동' },
  'final-pass@example.com': { stage: 'FINAL', isPassed: true, name: '홍길동' },
  'final-fail@example.com': { stage: 'FINAL', isPassed: false, name: '홍길동' },
};

const delay = () => new Promise((resolve) => setTimeout(resolve, 300));

// 조회 실패 확인용: 오프라인이면 실패로 응답한다
export const getRecruitResult = async (email: string): Promise<RecruitResult> => {
  await delay();
  if (!navigator.onLine) throw new Error('network error');
  return (
    MOCK_RESULTS[email] ?? {
      stage: 'DOCUMENT',
      isPassed: true,
      name: '홍길동',
      interviewAt: '2027-03-16T14:00:00+09:00',
      interviewPlace: '310관 B101호',
    }
  );
};
