// recoil 관련 state 모아두는 곳.

import { atom } from 'recoil';
import cookie from 'react-cookies';
import { v1 } from 'uuid';
export interface IToken {
  access: string;
  refresh: string;
}
export const token = atom<IToken>({
  key: `tokenoken/${v1()}`,
  // default: cookie.load('accessToken')
  default: {
    access: '',
    refresh: '',
  },
});
