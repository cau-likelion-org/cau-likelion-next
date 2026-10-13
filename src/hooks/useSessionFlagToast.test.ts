// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import useSessionFlagToast from './useSessionFlagToast';

const FLAG_KEY = 'project_deleted';

describe('useSessionFlagToast', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(cleanup);

  it('플래그가 있으면 토스트를 열고, 다시 뜨지 않도록 플래그를 지운다', () => {
    sessionStorage.setItem(FLAG_KEY, 'true');

    const { result } = renderHook(() => useSessionFlagToast(FLAG_KEY));

    expect(result.current.isOpen).toBe(true);
    expect(sessionStorage.getItem(FLAG_KEY)).toBeNull();
  });

  it('플래그가 없으면 토스트를 열지 않는다', () => {
    const { result } = renderHook(() => useSessionFlagToast(FLAG_KEY));

    expect(result.current.isOpen).toBe(false);
  });

  it("값이 'true'가 아니면 열지 않고 플래그도 건드리지 않는다", () => {
    sessionStorage.setItem(FLAG_KEY, 'false');

    const { result } = renderHook(() => useSessionFlagToast(FLAG_KEY));

    expect(result.current.isOpen).toBe(false);
    expect(sessionStorage.getItem(FLAG_KEY)).toBe('false');
  });

  it('onHidden을 부르면 닫힌다', () => {
    sessionStorage.setItem(FLAG_KEY, 'true');
    const { result } = renderHook(() => useSessionFlagToast(FLAG_KEY));

    act(() => result.current.onHidden());

    expect(result.current.isOpen).toBe(false);
  });
});
