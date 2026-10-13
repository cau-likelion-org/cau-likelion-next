import axios, { AxiosAdapter, AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getRoadmap } from './roadmap';

vi.mock('src/lib/env', () => ({ env: { apiUrl: 'https://api.test' } }));

describe('getRoadmap', () => {
  const originalAdapter = axios.defaults.adapter;
  const adapter = vi.fn<AxiosAdapter>();

  const respondWith = (status: number, data: unknown = {}) =>
    adapter.mockImplementation((config) => {
      const response = { data, status, statusText: '', headers: {}, config };
      return status < 400
        ? Promise.resolve(response)
        : Promise.reject(new AxiosError('요청 실패', undefined, config, undefined, response));
    });

  beforeEach(() => {
    axios.defaults.adapter = adapter;
  });

  afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    adapter.mockReset();
  });

  it('등록된 로드맵을 돌려준다', async () => {
    respondWith(200, { id: 1, imageUrl: 'https://example.com/roadmap.webp' });

    await expect(getRoadmap()).resolves.toEqual({ id: 1, imageUrl: 'https://example.com/roadmap.webp' });
    expect(adapter.mock.calls[0][0].url).toBe('https://api.test/api/admin/roadmap');
  });

  it('아직 등록된 로드맵이 없으면(404) 에러 대신 null을 돌려준다', async () => {
    respondWith(404);

    await expect(getRoadmap()).resolves.toBeNull();
  });

  it('그 밖의 실패는 그대로 던진다', async () => {
    respondWith(500);

    await expect(getRoadmap()).rejects.toMatchObject({ response: { status: 500 } });
  });
});
