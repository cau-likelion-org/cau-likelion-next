// recoil 관련 state 모아두는 곳.

import { atom } from 'recoil';
import { v1 } from 'uuid';
import cookie from 'react-cookies';
import { UserProfile } from '@@types/request';

export interface IToken {
  access: string;
  refresh: string;
}

export const token = atom<IToken>({
  key: `token/${v1()}`,
  default: {
    access: cookie.load('access'),
    refresh: cookie.load('refresh')
    // access: '',
    // refresh: ''
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
