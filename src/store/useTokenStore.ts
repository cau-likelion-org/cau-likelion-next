import { create } from 'zustand';
import LocalStorage from '@utils/localStorage';

export interface IToken {
  access: string | null;
  refresh: string | null;
}

interface TokenStore {
  token: IToken;
  setToken: (next: IToken | ((prev: IToken) => IToken)) => void;
}

const useTokenStore = create<TokenStore>((set, get) => ({
  token: {
    access: LocalStorage.getItem('access'),
    refresh: LocalStorage.getItem('refresh'),
  },
  setToken: (next) => {
    const token = typeof next === 'function' ? next(get().token) : next;

    if (token.access) LocalStorage.setItem('access', token.access);
    else LocalStorage.removeItem('access');

    if (token.refresh) LocalStorage.setItem('refresh', token.refresh);
    else LocalStorage.removeItem('refresh');

    set({ token });
  },
}));

export default useTokenStore;
