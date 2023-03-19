// recoil 관련 state 모아두는 곳.

import { atom } from 'recoil';
import { v1 } from 'uuid';
import LocalStorage from './localStorage';

export interface IToken {
  access: string | null;
  refresh: string | null;
}

export const token = atom<IToken>({
  key: `token/${v1()}`,
  default: {
    access: LocalStorage.getItem('access'),
    refresh: LocalStorage.getItem('refresh')
  }
});

export const userProfileChanged = atom<boolean>({
  key: `userProfile/${v1()}`,
  default: false
});

export const userScoreChanged = atom<boolean>({
  key: `userScore/${v1()}`,
  default: false
})

