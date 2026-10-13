// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getUserProfile } from './account';
import { getAuthAxios } from './authAxios';

vi.mock('./authAxios', () => ({ getAuthAxios: vi.fn() }));

const TOKEN = { access: 'access', refresh: 'refresh' };
const PROFILE = { id: 1, name: '푸앙', role: 'BABY_LION' };

describe('getUserProfile의 개발 모드 역할 오버라이드', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    vi.mocked(getAuthAxios).mockReturnValue({
      get: vi.fn().mockResolvedValue({ data: PROFILE }),
    } as unknown as ReturnType<typeof getAuthAxios>);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    window.history.replaceState(null, '', '/');
    warn.mockClear();
  });

  it('개발 모드에서 ?role= 쿼리가 있으면 그 역할로 덮어쓴다', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    window.history.replaceState(null, '', '/mypage?role=STAFF');

    await expect(getUserProfile(TOKEN)).resolves.toEqual({ ...PROFILE, role: 'STAFF' });
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('허용되지 않은 역할 값은 무시한다', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    window.history.replaceState(null, '', '/mypage?role=SUPERUSER');

    await expect(getUserProfile(TOKEN)).resolves.toEqual(PROFILE);
    expect(warn).not.toHaveBeenCalled();
  });

  it('실제 역할과 같으면 덮어쓰지 않는다', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    window.history.replaceState(null, '', '/mypage?role=BABY_LION');

    await expect(getUserProfile(TOKEN)).resolves.toEqual(PROFILE);
    expect(warn).not.toHaveBeenCalled();
  });

  it('개발 모드가 아니면 쿼리가 있어도 서버 응답을 그대로 쓴다', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    window.history.replaceState(null, '', '/mypage?role=ADMIN');

    await expect(getUserProfile(TOKEN)).resolves.toEqual(PROFILE);
  });
});
