import LocalStorage from '@utils/localStorage';
import { IToken } from '@utils/state';
import axios from 'axios';
import Axios from 'axios';
import { getNewToken } from './account';

export const getAuthAxios = (token: IToken) => {
  const authAxios = Axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_KEY}`,
    headers: {
      Authorization: `${token.access}`,
    },
  });
  authAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      if (status !== 401) {
        return Promise.reject(error);
      }
      try {
        const { access: newAccessToken, refresh } = await getNewToken(token.refresh);
        LocalStorage.setItem('access', newAccessToken);
        LocalStorage.setItem('refresh', refresh);
        config.headers.Authorization = `${newAccessToken}`;
        const response = await axios.get(config.url, config);
        return Promise.resolve(response);
      } catch (err: any) {
        LocalStorage.removeItem('access');
        LocalStorage.removeItem('refresh');
        window.location.href = '/login';
        return;
      }
    },
  );
  return authAxios;
};
