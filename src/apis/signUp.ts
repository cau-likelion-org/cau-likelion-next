import { RequestSignUpForm } from '@@types/request';
import { IToken } from '@utils/state';
import { getAuthAxios } from './authAxios';

export const getEmailSecret = async (token: IToken, emailValue: string) => {
  const axiosInstance = getAuthAxios(token);
  const response = await axiosInstance.get(`/api/accounts/caumail`, {
    params: { email: `${emailValue}@cau.ac.kr` },
  });
  return response;
};

interface IMailResponse {
  data: boolean;
}

export const postEmailSecret = async (token: IToken, secretValue: string) => {
  const axiosInstance = getAuthAxios(token);
  const response = await axiosInstance.post<IMailResponse>(`/api/accounts/caumail`, {
    code: secretValue,
  });
  return response.data;
};

export interface IMutationProps {
  form: RequestSignUpForm;
  accessToken: string;
  refreshToken: string;
}

export const putUserProfile = async (props: IMutationProps) => {
  const axiosInstance = getAuthAxios({ access: props.accessToken, refresh: props.refreshToken });
  const response = await axiosInstance.put(`/api/accounts/profile`, {
    name: props.form.name,
    generation: props.form.generation,
    track: props.form.track,
    is_admin: props.form.is_admin,
  });
  return response.data;
};
