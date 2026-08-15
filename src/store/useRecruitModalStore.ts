import { create } from 'zustand';

type RecruitModalStep = 'closed' | 'closedAlert' | 'notify';
type RecruitToastVariant = 'positive' | 'negative';

interface RecruitToast {
  variant: RecruitToastVariant;
  message: string;
}

interface RecruitModalStore {
  step: RecruitModalStep;
  toast: RecruitToast | null;
  openClosedAlert: () => void;
  openNotifyModal: () => void;
  close: () => void;
  closeWithToast: (variant: RecruitToastVariant, message: string) => void;
  clearToast: () => void;
}

const useRecruitModalStore = create<RecruitModalStore>((set) => ({
  step: 'closed',
  toast: null,
  openClosedAlert: () => set({ step: 'closedAlert' }),
  openNotifyModal: () => set({ step: 'notify' }),
  close: () => set({ step: 'closed' }),
  // 신청 결과 토스트는 모달이 닫힌 뒤 랜딩 화면 위에 떠야 해서, 모달을 닫음과 동시에 예약한다
  closeWithToast: (variant, message) => set({ step: 'closed', toast: { variant, message } }),
  clearToast: () => set({ toast: null }),
}));

export default useRecruitModalStore;
