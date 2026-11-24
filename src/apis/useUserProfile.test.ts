import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import { shouldRetryUserProfile } from './useUserProfile';

const axiosError = (status: number) =>
  new AxiosError('error', String(status), undefined, undefined, {
    status,
    statusText: '',
    data: null,
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('shouldRetryUserProfile', () => {
  it('인증 오류(401·403)는 재시도하지 않는다', () => {
    expect(shouldRetryUserProfile(0, axiosError(401))).toBe(false);
    expect(shouldRetryUserProfile(0, axiosError(403))).toBe(false);
  });

  it('그 밖의 오류는 3번까지 재시도한다', () => {
    expect(shouldRetryUserProfile(0, axiosError(500))).toBe(true);
    expect(shouldRetryUserProfile(2, new Error('network'))).toBe(true);
    expect(shouldRetryUserProfile(3, new Error('network'))).toBe(false);
  });
});
