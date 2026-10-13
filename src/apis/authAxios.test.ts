import axios, { AxiosAdapter, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useTokenStore from 'src/store/useTokenStore';
import { reissueToken } from './account';
import { getAuthAxios } from './authAxios';

vi.mock('src/lib/env', () => ({ env: { apiUrl: 'https://api.test' } }));
vi.mock('./account', () => ({ reissueToken: vi.fn() }));

const reissueTokenMock = vi.mocked(reissueToken);

const jwtExpiringIn = (seconds: number) =>
  `header.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + seconds }))}.signature`;

const VALID_ACCESS = jwtExpiringIn(3600);
const NEW_ACCESS = jwtExpiringIn(7200);
const NEW_TOKENS = { accessToken: NEW_ACCESS, refreshToken: 'new-refresh' };

const sentAuthorizations: unknown[] = [];

const respond = (config: InternalAxiosRequestConfig, status: number) => {
  sentAuthorizations.push(config.headers.Authorization);
  const response = { data: { status }, status, statusText: '', headers: {}, config };
  return status < 400
    ? Promise.resolve(response)
    : Promise.reject(new AxiosError('요청 실패', undefined, config, undefined, response));
};

describe('getAuthAxios', () => {
  const originalAdapter = axios.defaults.adapter;
  const adapter = vi.fn<AxiosAdapter>();

  beforeEach(() => {
    axios.defaults.adapter = adapter;
    useTokenStore.getState().setToken({ access: VALID_ACCESS, refresh: 'refresh' });
  });

  afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    adapter.mockReset();
    sentAuthorizations.length = 0;
    reissueTokenMock.mockReset();
  });

  const request = () => getAuthAxios(useTokenStore.getState().token).get('/api/members/me');

  it('저장된 액세스 토큰을 Authorization 헤더에 싣는다', async () => {
    adapter.mockImplementation((config) => respond(config, 200));

    await request();

    expect(sentAuthorizations).toEqual([`Bearer ${VALID_ACCESS}`]);
    expect(reissueTokenMock).not.toHaveBeenCalled();
  });

  it('만료가 임박한 토큰은 요청 전에 재발급해 새 토큰으로 보낸다', async () => {
    useTokenStore.getState().setToken({ access: jwtExpiringIn(5), refresh: 'refresh' });
    reissueTokenMock.mockResolvedValue(NEW_TOKENS);
    adapter.mockImplementation((config) => respond(config, 200));

    await request();

    expect(reissueTokenMock).toHaveBeenCalledTimes(1);
    expect(reissueTokenMock).toHaveBeenCalledWith('refresh');
    expect(sentAuthorizations).toEqual([`Bearer ${NEW_ACCESS}`]);
    expect(useTokenStore.getState().token).toEqual({ access: NEW_ACCESS, refresh: 'new-refresh' });
  });

  it.each([401, 403])('%i 응답을 받으면 재발급 후 같은 요청을 새 토큰으로 다시 보낸다', async (status) => {
    reissueTokenMock.mockResolvedValue(NEW_TOKENS);
    adapter
      .mockImplementationOnce((config) => respond(config, status))
      .mockImplementationOnce((config) => respond(config, 200));

    const response = await request();

    expect(response.status).toBe(200);
    expect(sentAuthorizations).toEqual([`Bearer ${VALID_ACCESS}`, `Bearer ${NEW_ACCESS}`]);
  });

  it('동시에 여러 요청이 401을 받아도 재발급은 한 번만 호출한다', async () => {
    reissueTokenMock.mockResolvedValue(NEW_TOKENS);
    adapter.mockImplementation((config) =>
      respond(config, config.headers.Authorization === `Bearer ${NEW_ACCESS}` ? 200 : 401),
    );

    const responses = await Promise.all([request(), request(), request()]);

    expect(responses.map(({ status }) => status)).toEqual([200, 200, 200]);
    expect(reissueTokenMock).toHaveBeenCalledTimes(1);
  });

  it('재발급이 실패하면 세션을 비우고 요청을 실패시킨다', async () => {
    reissueTokenMock.mockRejectedValue(new Error('리프레시 토큰 만료'));
    adapter.mockImplementation((config) => respond(config, 401));

    await expect(request()).rejects.toThrow('리프레시 토큰 만료');

    expect(useTokenStore.getState().token).toEqual({ access: null, refresh: null });
  });

  it('재발급 후에도 403이면 권한 문제로 보고 세션은 유지한 채 실패시킨다', async () => {
    reissueTokenMock.mockResolvedValue(NEW_TOKENS);
    adapter.mockImplementation((config) => respond(config, 403));

    await expect(request()).rejects.toMatchObject({ response: { status: 403 } });

    expect(adapter).toHaveBeenCalledTimes(2);
    expect(useTokenStore.getState().token).toEqual({ access: NEW_ACCESS, refresh: 'new-refresh' });
  });

  it('리프레시 토큰이 없으면 재발급 없이 그대로 실패시킨다', async () => {
    useTokenStore.getState().setToken({ access: VALID_ACCESS, refresh: null });
    adapter.mockImplementation((config) => respond(config, 401));

    await expect(request()).rejects.toMatchObject({ response: { status: 401 } });

    expect(reissueTokenMock).not.toHaveBeenCalled();
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it('인증과 무관한 실패는 재발급하지 않는다', async () => {
    adapter.mockImplementation((config) => respond(config, 500));

    await expect(request()).rejects.toMatchObject({ response: { status: 500 } });

    expect(reissueTokenMock).not.toHaveBeenCalled();
  });
});
