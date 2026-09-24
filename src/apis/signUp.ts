import { JoinRequest, TokenResponse } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export const SIGNUP_SUCCESS_FLAG_KEY = 'signupSuccess';
export const SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY = 'signupUnapprovedEmail';
export const PENDING_SIGNUP_TOKEN_KEY = 'pendingSignupToken';
// 로그인 페이지의 Signup Required부터 가입 폼의 Signup Submitted/Failed까지 하나의 시도로 묶어서 보기 위한 id
export const PENDING_SIGNUP_ATTEMPT_ID_KEY = 'pendingSignupAttemptId';

export const clearPendingSignupToken = () => {
  sessionStorage.removeItem(PENDING_SIGNUP_TOKEN_KEY);
  sessionStorage.removeItem(PENDING_SIGNUP_ATTEMPT_ID_KEY);
};

export const signUp = (form: JoinRequest) => {
  return axios.post<TokenResponse>(`${url}/api/auth/join`, form).then((res) => res.data);
};
