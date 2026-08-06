import { RequestSignUpForm } from '@@types/request';
import { getAuthAxios } from './authAxios';

export const SIGNUP_SUCCESS_FLAG_KEY = 'signupSuccess';
export const SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY = 'signupUnapprovedEmail';
export const PENDING_SIGNUP_ACCESS_TOKEN_KEY = 'pendingSignupAccessToken';
export const PENDING_SIGNUP_REFRESH_TOKEN_KEY = 'pendingSignupRefreshToken';

export const clearPendingSignupTokens = () => {
  sessionStorage.removeItem(PENDING_SIGNUP_ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(PENDING_SIGNUP_REFRESH_TOKEN_KEY);
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
  return response.data;
};
