// recoil 관련 state 모아두는 곳.

import { atom } from 'recoil';
import cookie from 'react-cookies';
import { v1 } from 'uuid';

export const accessToken = atom<string>({
    key: `accessToken/${v1()}`,
    default: cookie.load('accessToken')
});
