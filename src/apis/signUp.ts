import { RequestSignUpForm } from '@@types/request';
import { IToken } from '@utils/state';
import axios from 'axios';
import { getAuthAxios } from './authAxios';
import { url } from '.';

export const getEmailSecret = async (token: IToken, emailValue: string) => {
  const axiosInstance = getAuthAxios(token);
  const response = await axiosInstance.get(`${url}/caumail`, {
    params: { email: `${emailValue}@cau.ac.kr` },
  });
  return response;
};

interface IMailResponse {
  data: boolean;
}

export const postEmailSecret = async (token: IToken, secretValue: string) => {
  const axiosInstance = getAuthAxios(token);
  const response = await axiosInstance.post<IMailResponse>(`/caumail`, {
    code: secretValue,
  });

  return response.data;
};

export interface SignUpMutationProps {
  form: RequestSignUpForm;
  accessToken: string | null;
  refreshToken: string | null;
}

export const signUp = async (props: SignUpMutationProps) => {
  const axiosInstance = getAuthAxios({ access: props.accessToken, refresh: props.refreshToken });
  const response = await axiosInstance.put(`/api/signup`, {
    name: props.form.name,
    generation: props.form.generation,
    track: props.form.track,
    is_admin: props.form.is_admin,
  });
  console.log(response.data);
  return response.data;
};
