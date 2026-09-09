import { IToken } from 'src/store/useTokenStore';
import useTokenStore from 'src/store/useTokenStore';
import axios from 'axios';
import { reissueToken } from './account';

const REFRESH_BUFFER_MS = 10_000;

// 이 서버는 인증 실패에도 401 대신 403을 주는 경우가 있어 두 상태 모두 재발급 대상으로 본다.
// 권한 부족(운영진 전용 API)이라 재시도해도 다시 403이면 로그아웃 없이 그대로 실패시킨다
const AUTH_ERROR_STATUSES = [401, 403];

let refreshPromise: ReturnType<typeof reissueToken> | null = null;

const clearSessionAndRedirect = () => {
  useTokenStore.getState().setToken({ access: null, refresh: null });
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const decodeJwtExpiry = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

// 동시에 여러 요청이 401을 받아도 재발급 호출은 한 번만 나가도록 진행 중인 Promise를 공유
const refreshTokens = (refreshToken: string) => {
  if (!refreshPromise) {
    refreshPromise = reissueToken(refreshToken)
      .then((res) => {
        useTokenStore.getState().setToken({ access: res.accessToken, refresh: res.refreshToken });
        return res;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const getAuthAxios = (token: IToken) => {
  const authAxios = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_KEY}`,
  });

  // 만료 임박한 액세스 토큰은 요청 전에 미리 재발급 (401 왕복을 피함)
  authAxios.interceptors.request.use(async (config) => {
    const current = useTokenStore.getState().token;
    let accessToken = current.access;
    const refreshToken = current.refresh;
    const expiresAt = accessToken ? decodeJwtExpiry(accessToken) : null;

    if (accessToken && refreshToken && expiresAt !== null && expiresAt - Date.now() < REFRESH_BUFFER_MS) {
      try {
        accessToken = (await refreshTokens(refreshToken)).accessToken;
      } catch {
        // 재발급이 실패하면 이미 만료된 토큰으로 보내봐야 실패하므로 바로 로그인으로 보낸다
        clearSessionAndRedirect();
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  // 위 사전 재발급을 놓친 경우(시계 오차 등)를 위한 보험용 재시도
  authAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { config, response } = error;
      const refreshToken = useTokenStore.getState().token.refresh;
      if (!AUTH_ERROR_STATUSES.includes(response?.status) || !refreshToken) {
        return Promise.reject(error);
      }
      let accessToken: string;
      try {
        ({ accessToken } = await refreshTokens(refreshToken));
      } catch (err) {
        // 재발급 자체가 실패 = 세션이 끝난 상태
        clearSessionAndRedirect();
        return Promise.reject(err);
      }
      // 재발급은 됐는데도 실패하면 인증이 아니라 권한 문제이므로 세션은 유지한 채 그대로 실패시킨다
      config.headers.Authorization = `Bearer ${accessToken}`;
      const retried = await axios.request(config);
      return retried;
    },
  );

  return authAxios;
};
