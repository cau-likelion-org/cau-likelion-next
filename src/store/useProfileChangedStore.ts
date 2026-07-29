import { create } from 'zustand';

interface ProfileChangedStore {
  profileChanged: boolean;
  toggleProfileChanged: () => void;
}

const useProfileChangedStore = create<ProfileChangedStore>((set, get) => ({
  profileChanged: false,
  toggleProfileChanged: () => set({ profileChanged: !get().profileChanged }),
}));

export default useProfileChangedStore;
