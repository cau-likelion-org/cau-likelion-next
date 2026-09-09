import { JoinRequest, TokenResponse } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export const SIGNUP_SUCCESS_FLAG_KEY = 'signupSuccess';
export const SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY = 'signupUnapprovedEmail';
export const PENDING_SIGNUP_TOKEN_KEY = 'pendingSignupToken';

export const clearPendingSignupToken = () => {
  sessionStorage.removeItem(PENDING_SIGNUP_TOKEN_KEY);
};

export const signUp = (form: JoinRequest) => {
  return axios.post<TokenResponse>(`${url}/api/auth/join`, form).then((res) => res.data);
};
