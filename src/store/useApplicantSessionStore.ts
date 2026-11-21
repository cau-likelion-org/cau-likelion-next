import { create } from 'zustand';

import { ApplicantProfile } from '@recruit/apply/mock';

// 지원서 작성 중인 지원자와 임시 저장 암호화 키. 비밀번호에서 만든 키라 새로고침하면 사라지도록 메모리에만 둔다
export interface ApplicantSession {
  profile: ApplicantProfile;
  draftKey: CryptoKey;
}

interface ApplicantSessionStore {
  session: ApplicantSession | null;
  isDraftChosen: boolean;
  setSession: (session: ApplicantSession) => void;
  chooseDraft: () => void;
  clearSession: () => void;
}

const useApplicantSessionStore = create<ApplicantSessionStore>((set) => ({
  session: null,
  isDraftChosen: false,
  setSession: (session) => set({ session, isDraftChosen: false }),
  chooseDraft: () => set({ isDraftChosen: true }),
  clearSession: () => set({ session: null, isDraftChosen: false }),
}));

export default useApplicantSessionStore;
