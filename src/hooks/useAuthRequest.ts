import { token } from '@utils/state';
import axios from 'axios';
import Axios from 'axios';
import { useRecoilState } from 'recoil';
import { getNewToken } from 'src/apis/account';

export const useAuthRequest = () => {
  const [{ access, refresh }, setToken] = useRecoilState(token);

  const axiosAuth = Axios.create({
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  axiosAuth.interceptors.request.use(
    (res) => res,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      if (status !== 401) {
        return Promise.reject(error);
      }
      const { access: newAccessToken } = await getNewToken(refresh);
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      setToken((prevToken) => {
        const newToken = { ...prevToken };
        newToken.access = newAccessToken;
        return newToken;
      });

      return axios(config);
    },
  );
  return axiosAuth;
};
