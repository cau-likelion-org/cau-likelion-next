// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useLeaveGuard from './useLeaveGuard';

const { push, events } = vi.hoisted(() => {
  const handlers = new Map<string, Set<(url: string) => void>>();
  return {
    push: vi.fn(),
    events: {
      on: (name: string, handler: (url: string) => void) => {
        if (!handlers.has(name)) handlers.set(name, new Set());
        handlers.get(name)!.add(handler);
      },
      off: (name: string, handler: (url: string) => void) => handlers.get(name)?.delete(handler),
      emit: (name: string, url = '') => handlers.get(name)?.forEach((handler) => handler(url)),
    },
  };
});
vi.mock('next/router', () => ({ useRouter: () => ({ push, events }) }));

const startRouteChange = (url: string) => {
  try {
    events.emit('routeChangeStart', url);
    return false;
  } catch {
    return true;
  }
};

describe('useLeaveGuard', () => {
  afterEach(() => {
    cleanup();
    push.mockReset();
  });

  it('변경사항이 없으면 라우트 이동을 막지 않는다', () => {
    const { result } = renderHook(() => useLeaveGuard(false));

    expect(startRouteChange('/mypage')).toBe(false);
    expect(result.current.isConfirmOpen).toBe(false);
  });

  it('변경사항이 있으면 라우트 이동을 막고 확인 모달을 연다', () => {
    const { result } = renderHook(() => useLeaveGuard(true));

    let blocked = false;
    act(() => {
      blocked = startRouteChange('/mypage');
    });

    expect(blocked).toBe(true);
    expect(result.current.isConfirmOpen).toBe(true);
  });

  it('이탈을 확인하면 막았던 경로로 이동하고 다시 막지 않는다', () => {
    const { result } = renderHook(() => useLeaveGuard(true));
    act(() => {
      startRouteChange('/mypage');
    });

    act(() => result.current.confirmLeave());

    expect(push).toHaveBeenCalledWith('/mypage');
    expect(result.current.isConfirmOpen).toBe(false);
    expect(startRouteChange('/mypage')).toBe(false);
  });

  it('이탈을 취소하면 모달만 닫고 이동하지 않는다', () => {
    const { result } = renderHook(() => useLeaveGuard(true));
    act(() => {
      startRouteChange('/mypage');
    });

    act(() => result.current.cancelLeave());

    expect(push).not.toHaveBeenCalled();
    expect(result.current.isConfirmOpen).toBe(false);
  });

  it('직접 이탈 요청은 변경사항이 없으면 바로 실행한다', () => {
    const leave = vi.fn();
    const { result } = renderHook(() => useLeaveGuard(false));

    act(() => result.current.requestLeave(leave));

    expect(leave).toHaveBeenCalled();
    expect(result.current.isConfirmOpen).toBe(false);
  });

  it('직접 이탈 요청은 변경사항이 있으면 확인 후에 실행한다', () => {
    const leave = vi.fn();
    const { result } = renderHook(() => useLeaveGuard(true));

    act(() => result.current.requestLeave(leave));
    expect(leave).not.toHaveBeenCalled();
    expect(result.current.isConfirmOpen).toBe(true);

    act(() => result.current.confirmLeave());
    expect(leave).toHaveBeenCalled();
  });

  it('이탈 허용 후에는 변경사항이 있어도 막지 않는다', () => {
    const { result } = renderHook(() => useLeaveGuard(true));

    act(() => result.current.allowLeave());

    expect(startRouteChange('/mypage')).toBe(false);
  });

  it('이탈을 허용한 뒤 변경사항이 사라졌다가 다시 생기면 다시 막는다', () => {
    const { result, rerender } = renderHook(({ isDirty }) => useLeaveGuard(isDirty), {
      initialProps: { isDirty: true },
    });
    act(() => result.current.allowLeave());

    rerender({ isDirty: false });
    rerender({ isDirty: true });

    let blocked = false;
    act(() => {
      blocked = startRouteChange('/mypage');
    });
    expect(blocked).toBe(true);
  });

  it('변경사항이 있으면 새로고침 시 브라우저 경고를 띄운다', () => {
    renderHook(() => useLeaveGuard(true));
    const event = new Event('beforeunload', { cancelable: true });

    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });
});
