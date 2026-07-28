import { create } from 'zustand';

interface ScoreChangedStore {
  scoreChanged: boolean;
  toggleScoreChanged: () => void;
}

const useScoreChangedStore = create<ScoreChangedStore>((set, get) => ({
  scoreChanged: false,
  toggleScoreChanged: () => set({ scoreChanged: !get().scoreChanged }),
}));

export default useScoreChangedStore;
