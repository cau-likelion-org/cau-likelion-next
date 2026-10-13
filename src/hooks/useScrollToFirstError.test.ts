// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useScrollToFirstError from './useScrollToFirstError';

describe('useScrollToFirstError', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = `
      <input id="valid" />
      <input id="first-invalid" aria-invalid="true" />
      <input id="second-invalid" aria-invalid="true" />
    `;
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('에러가 표시된 첫 번째 필드로 스크롤하고 포커스를 옮긴다', () => {
    const firstInvalid = container.querySelector<HTMLInputElement>('#first-invalid')!;
    firstInvalid.scrollIntoView = vi.fn();
    const { result } = renderHook(() => useScrollToFirstError({ current: container }));

    result.current();

    expect(firstInvalid.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(document.activeElement).toBe(firstInvalid);
  });

  it('에러 필드가 없으면 아무 일도 하지 않는다', () => {
    container.innerHTML = '<input id="valid" />';
    const { result } = renderHook(() => useScrollToFirstError({ current: container }));

    expect(() => result.current()).not.toThrow();
    expect(document.activeElement).toBe(document.body);
  });
});
