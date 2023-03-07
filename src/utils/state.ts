// recoil 관련 state 모아두는 곳.

import { atom } from 'recoil';
import { v1 } from 'uuid';
import cookie from 'react-cookies';
import { UserProfile } from '@@types/request';
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

export const userInfo = atom<UserProfile>({
  key: `user/${v1()}`,
  default: {
    name: '',
    track: 0,
    is_admin: false,
    generation: 0,
  }
});
