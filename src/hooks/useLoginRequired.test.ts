// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useTokenStore from 'src/store/useTokenStore';
import useLoginRequired from './useLoginRequired';

const push = vi.hoisted(() => vi.fn());
vi.mock('next/router', () => ({ useRouter: () => ({ push }) }));

describe('useLoginRequired', () => {
  beforeEach(() => {
    useTokenStore.setState({ token: { access: null, refresh: null }, hasHydrated: true });
  });

  afterEach(() => {
    cleanup();
    push.mockReset();
  });

  it('로그인하지 않은 상태면 로그인 화면으로 보낸다', () => {
    renderHook(() => useLoginRequired());

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('보낼 주소를 바꿀 수 있다', () => {
    renderHook(() => useLoginRequired('/project'));

    expect(push).toHaveBeenCalledWith('/project');
  });

  it('로그인한 상태면 이동하지 않는다', () => {
    useTokenStore.setState({ token: { access: 'access', refresh: 'refresh' } });

    renderHook(() => useLoginRequired());

    expect(push).not.toHaveBeenCalled();
  });

  it('저장된 토큰을 아직 불러오지 않았으면 기다렸다가 판단한다', () => {
    useTokenStore.setState({ hasHydrated: false });

    renderHook(() => useLoginRequired());
    expect(push).not.toHaveBeenCalled();

    act(() => useTokenStore.setState({ hasHydrated: true }));
    expect(push).toHaveBeenCalledWith('/login');
  });
});
