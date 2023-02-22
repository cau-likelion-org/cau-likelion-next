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

interface IMailResponse {
  data: boolean;
}
export const postEmailSecret = async (accessToken: string, refreshToken: string, secretValue: string) => {
  const axiosInstance = getSignUpAxiosInstance(accessToken, refreshToken);
  const response = await axiosInstance.post<IMailResponse>(`api/accounts/caumail`, {
    code: secretValue,
  });
  return response.data;
};

export interface IMutationProps {
  form: RequestSignUpForm;
  accessToken: string;
  refreshToken: string;
}

export const postSignUpForm = async (props: IMutationProps) => {
  const axiosInstance = getSignUpAxiosInstance(props.accessToken, props.refreshToken);
  const response = await axiosInstance.put(`/api/accounts/profile`, {
    name: props.form.name,
    generation: props.form.generation,
    track: props.form.track,
    is_admin: props.form.isAdmin,
  });
  return response.data;
};
