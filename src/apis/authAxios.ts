import { IToken } from '@utils/state';
import axios from 'axios';
import Axios from 'axios';
import { getAcessToken } from './account';

export const getAuthAxios = (token: IToken) => {
  const authAxios = Axios.create({
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
      const { access: newAccessToken } = await getAcessToken(token.refresh);

      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(config);
    },
  );
  return authAxios;
};
