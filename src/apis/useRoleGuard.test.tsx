// @vitest-environment jsdom
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { UserProfile } from '@@types/request';
import useTokenStore from 'src/store/useTokenStore';
import useRoleGuard from './useRoleGuard';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/router', () => ({ useRouter: () => ({ push }) }));
vi.mock('src/apis/account', () => ({ getUserProfile: vi.fn() }));

const PROFILE = { id: 1, name: '관리자', role: 'ADMIN' } as UserProfile;
const canAccessAdmin = (role: string) => role === 'ADMIN';

const renderGuard = (queryClient: QueryClient) =>
  renderHook(() => useRoleGuard(canAccessAdmin), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

describe('useRoleGuard', () => {
  beforeEach(() => {
    useTokenStore.setState({ token: { access: 'access', refresh: 'refresh' }, hasHydrated: true });
  });

  afterEach(() => {
    cleanup();
    push.mockReset();
    localStorage.clear();
  });

  it('토큰과 접근 가능한 역할의 프로필이 있으면 권한이 있다', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['userProfile'], PROFILE);

    const { result } = renderGuard(queryClient);

    expect(result.current.isAuthorized).toBe(true);
  });

  it('토큰이 사라지면 캐시된 프로필이 남아 있어도 권한이 없다', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['userProfile'], PROFILE);
    const { result } = renderGuard(queryClient);

    act(() => useTokenStore.getState().setToken({ access: null, refresh: null }));

    expect(result.current.isAuthorized).toBe(false);
    await waitFor(() => expect(push).toHaveBeenCalledWith('/login'));
  });

  it('접근할 수 없는 역할이면 권한이 없고 마이페이지로 보낸다', async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['userProfile'], { ...PROFILE, role: 'STAFF' });

    const { result } = renderGuard(queryClient);

    expect(result.current.isAuthorized).toBe(false);
    await waitFor(() => expect(push).toHaveBeenCalledWith('/mypage'));
  });
});
