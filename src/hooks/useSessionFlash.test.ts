// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useSessionFlash from './useSessionFlash';

const KEY = 'flashKey';

describe('useSessionFlash', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('남겨진 값을 한 번 넘기고 지운다', () => {
    sessionStorage.setItem(KEY, '3');
    const onFlash = vi.fn();

    renderHook(() => useSessionFlash(KEY, onFlash));
    vi.runAllTimers();

    expect(onFlash).toHaveBeenCalledWith('3');
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('값이 없으면 부르지 않는다', () => {
    const onFlash = vi.fn();

    renderHook(() => useSessionFlash(KEY, onFlash));
    vi.runAllTimers();

    expect(onFlash).not.toHaveBeenCalled();
  });

  it('개발 모드에서 effect가 두 번 실행돼도 값을 한 번 넘긴다', () => {
    sessionStorage.setItem(KEY, 'edited');
    const onFlash = vi.fn();

    renderHook(() => useSessionFlash(KEY, onFlash), { wrapper: StrictMode });
    vi.runAllTimers();

    expect(onFlash).toHaveBeenCalledTimes(1);
    expect(onFlash).toHaveBeenCalledWith('edited');
  });
});
