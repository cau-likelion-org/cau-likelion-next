import { IToken } from '@utils/state';
import { getAuthAxios } from './authAxios';

export function postAttendance(password: string, token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.post(`/api/attendance`, {
    password: password,
  });
}
