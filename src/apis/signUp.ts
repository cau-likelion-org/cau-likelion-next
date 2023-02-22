import { RequestSignUpForm } from '@@types/request';
import axios from 'axios';
import Axios from 'axios';
import { getAcessToken } from './account';
const getSignUpAxiosInstance = (accessToken: string, refreshToken: string) => {
  const signUpAxiosInstance = Axios.create({
    headers: {
      Authorization: `${accessToken}`,
    },
  });
  signUpAxiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      if (status !== 401) {
        return Promise.reject(error);
      }
      const { access: newAccessToken } = await getAcessToken(refreshToken);

      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return axios(config);
    },
  );
  return signUpAxiosInstance;
};

export const getEmailSecret = async (accessToken: string, refreshToken: string, emailValue: string) => {
  const axiosInstance = getSignUpAxiosInstance(accessToken, refreshToken);
  const response = await axiosInstance.get(`/api/accounts/caumail`, {
    params: { email: `${emailValue}@cau.ac.kr` },
  });
  return response;
};

export const postEmailSecret = (accessToken: string, secretValue: string) => {
  // const response = axios.post(
  //     `${url}/cau_email`,
  //     {
  //         secret: secretValue
  //     },
  //     {
  //         headers: {
  //             Authorization: `Bearer ${accessToken}`
  //         }
  //     }
  // ).then((res) => '1234');
  return '1235';
};

export function postSignUpForm(form: RequestSignUpForm) {
  return axios.post(
    `/signup`,
    {
      name: form.name,
      generation: form.generation,
      track: form.track,
      is_admin: form.isAdmin,
    },
    {
      headers: {
        Authorization: `Bearer ${form.accessToken}`,
      },
    },
  );
}
