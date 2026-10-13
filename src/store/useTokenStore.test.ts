// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';

import useTokenStore from './useTokenStore';

describe('useTokenStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useTokenStore.setState({ token: { access: null, refresh: null }, hasHydrated: false });
  });

  it('setToken은 토큰을 스토어와 localStorage에 함께 저장한다', () => {
    useTokenStore.getState().setToken({ access: 'access', refresh: 'refresh' });

    expect(useTokenStore.getState().token).toEqual({ access: 'access', refresh: 'refresh' });
    expect(localStorage.getItem('access')).toBe('access');
    expect(localStorage.getItem('refresh')).toBe('refresh');
  });

  it('null로 설정하면 localStorage에서도 지운다', () => {
    useTokenStore.getState().setToken({ access: 'access', refresh: 'refresh' });

    useTokenStore.getState().setToken({ access: null, refresh: null });

    expect(localStorage.getItem('access')).toBeNull();
    expect(localStorage.getItem('refresh')).toBeNull();
  });

  it('함수를 넘기면 이전 토큰을 기준으로 갱신한다', () => {
    useTokenStore.getState().setToken({ access: 'old', refresh: 'refresh' });

    useTokenStore.getState().setToken((prev) => ({ ...prev, access: 'new' }));

    expect(useTokenStore.getState().token).toEqual({ access: 'new', refresh: 'refresh' });
    expect(localStorage.getItem('access')).toBe('new');
  });

  it('hydrate는 localStorage에 남아 있던 토큰을 불러오고 완료를 표시한다', () => {
    localStorage.setItem('access', 'saved-access');
    localStorage.setItem('refresh', 'saved-refresh');

    useTokenStore.getState().hydrate();

    expect(useTokenStore.getState()).toMatchObject({
      token: { access: 'saved-access', refresh: 'saved-refresh' },
      hasHydrated: true,
    });
  });

  it('저장된 토큰이 없어도 hydrate 완료는 표시한다', () => {
    useTokenStore.getState().hydrate();

    expect(useTokenStore.getState()).toMatchObject({ token: { access: null, refresh: null }, hasHydrated: true });
  });
});
