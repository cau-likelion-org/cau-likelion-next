import { create } from 'zustand';

import { ApplicantProfile } from '@recruit/apply/mock';

// 지원서 작성 중인 지원자와 임시 저장 암호화 키. 비밀번호에서 만든 키라 새로고침하면 사라지도록 메모리에만 둔다
export interface ApplicantSession {
  profile: ApplicantProfile;
  draftKey: CryptoKey;
}

interface ApplicantSessionStore {
  session: ApplicantSession | null;
  setSession: (session: ApplicantSession) => void;
  clearSession: () => void;
}

const useApplicantSessionStore = create<ApplicantSessionStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));

export default useApplicantSessionStore;
