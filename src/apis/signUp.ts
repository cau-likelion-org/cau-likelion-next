import { RequestSignUpForm } from '@@types/request';
import { getAuthAxios } from './authAxios';

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
  return response.data;
};
