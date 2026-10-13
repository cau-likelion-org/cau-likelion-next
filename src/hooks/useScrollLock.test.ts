// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import useScrollLock from './useScrollLock';

describe('useScrollLock', () => {
  afterEach(() => {
    cleanup();
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  });

  it('마운트되면 스크롤을 막고, 언마운트되면 원래 값으로 되돌린다', () => {
    document.body.style.overflow = 'auto';

    const { unmount } = renderHook(() => useScrollLock());

    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.documentElement.style.overflow).toBe('');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('여러 곳에서 동시에 잠그면 마지막 하나가 풀릴 때까지 유지한다', () => {
    const first = renderHook(() => useScrollLock());
    const second = renderHook(() => useScrollLock());

    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    second.unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('isLocked가 false면 아무것도 바꾸지 않는다', () => {
    renderHook(() => useScrollLock(false));

    expect(document.body.style.overflow).toBe('');
  });

  it('isLocked가 바뀌면 그에 맞춰 잠그고 푼다', () => {
    const { rerender } = renderHook(({ isLocked }) => useScrollLock(isLocked), { initialProps: { isLocked: false } });

    rerender({ isLocked: true });
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ isLocked: false });
    expect(document.body.style.overflow).toBe('');
  });
});
