import { IToken } from 'src/store/useTokenStore';
import useTokenStore from 'src/store/useTokenStore';
import axios from 'axios';
import { reissueToken } from './account';

const REFRESH_BUFFER_MS = 10_000;

let refreshPromise: ReturnType<typeof reissueToken> | null = null;

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
    let accessToken = current.access ?? token.access;
    const refreshToken = current.refresh ?? token.refresh;
    const expiresAt = accessToken ? decodeJwtExpiry(accessToken) : null;

    if (accessToken && refreshToken && expiresAt !== null && expiresAt - Date.now() < REFRESH_BUFFER_MS) {
      try {
        accessToken = (await refreshTokens(refreshToken)).accessToken;
      } catch {
        // 재발급 실패 시에도 일단 요청은 보내고, 401 응답은 아래 응답 인터셉터에서 처리
      }
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  // 위 사전 재발급을 놓친 경우(시계 오차 등)를 위한 보험용 401 재시도
  authAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const { config, response } = error;
      const refreshToken = useTokenStore.getState().token.refresh ?? token.refresh;
      if (response?.status !== 401 || !refreshToken) {
        return Promise.reject(error);
      }
      try {
        const { accessToken } = await refreshTokens(refreshToken);
        config.headers.Authorization = `Bearer ${accessToken}`;
        const retried = await axios.request(config);
        return Promise.resolve(retried);
      } catch (err) {
        useTokenStore.getState().setToken({ access: null, refresh: null });
        window.location.href = '/login';
        return Promise.reject(err);
      }
    },
  );

  return authAxios;
};
