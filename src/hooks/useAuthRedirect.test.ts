// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useTokenStore from 'src/store/useTokenStore';
import useAuthRedirect from './useAuthRedirect';

const replace = vi.hoisted(() => vi.fn());
vi.mock('next/router', () => ({ useRouter: () => ({ replace }) }));

describe('useAuthRedirect', () => {
  beforeEach(() => {
    useTokenStore.setState({ token: { access: null, refresh: null } });
  });

  afterEach(() => {
    cleanup();
    replace.mockReset();
  });

  it('로그인하지 않은 상태면 이동하지 않는다', () => {
    renderHook(() => useAuthRedirect());

    expect(replace).not.toHaveBeenCalled();
  });

  it('이미 로그인한 상태면 마이페이지로 보낸다', () => {
    useTokenStore.setState({ token: { access: 'access', refresh: 'refresh' } });

    renderHook(() => useAuthRedirect());

    expect(replace).toHaveBeenCalledWith('/mypage');
  });

  it('화면에 머무는 중에 로그인되면 그때 마이페이지로 보낸다', () => {
    renderHook(() => useAuthRedirect());

    act(() => useTokenStore.setState({ token: { access: 'access', refresh: 'refresh' } }));

    expect(replace).toHaveBeenCalledWith('/mypage');
  });
});
