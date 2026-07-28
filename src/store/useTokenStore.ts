import { create } from 'zustand';
import LocalStorage from '@utils/localStorage';

export interface IToken {
  access: string | null;
  refresh: string | null;
}

interface TokenStore {
  token: IToken;
  hasHydrated: boolean;
  setToken: (next: IToken | ((prev: IToken) => IToken)) => void;
  hydrate: () => void;
}

const useTokenStore = create<TokenStore>((set, get) => ({
  token: {
    access: null,
    refresh: null,
  },
  hasHydrated: false,
  setToken: (next) => {
    const token = typeof next === 'function' ? next(get().token) : next;

    if (token.access) LocalStorage.setItem('access', token.access);
    else LocalStorage.removeItem('access');

    if (token.refresh) LocalStorage.setItem('refresh', token.refresh);
    else LocalStorage.removeItem('refresh');

    set({ token });
  },
  hydrate: () => {
    set({
      token: {
        access: LocalStorage.getItem('access'),
        refresh: LocalStorage.getItem('refresh'),
      },
      hasHydrated: true,
    });
  },
}));

export default useTokenStore;
