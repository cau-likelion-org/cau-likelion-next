// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useRequiredFieldsSave from './useRequiredFieldsSave';

describe('useRequiredFieldsSave', () => {
  let container: HTMLDivElement;
  let invalidField: HTMLInputElement;

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    container = document.body.appendChild(document.createElement('div'));
    container.innerHTML = '<input id="invalid" aria-invalid="true" />';
    invalidField = container.querySelector<HTMLInputElement>('#invalid')!;
    invalidField.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('처음에는 오류를 표시하지 않는다', () => {
    const { result } = renderHook(() => useRequiredFieldsSave({ current: container }));

    expect(result.current.showErrors).toBe(false);
  });

  it('오류가 있으면 false를 돌려주고 오류 표시를 켠 뒤 첫 오류 필드로 스크롤한다', () => {
    const { result } = renderHook(() => useRequiredFieldsSave({ current: container }));

    let isValid = true;
    act(() => {
      isValid = result.current.validate(true);
    });

    expect(isValid).toBe(false);
    expect(result.current.showErrors).toBe(true);
    expect(invalidField.scrollIntoView).toHaveBeenCalled();
  });

  it('오류가 없으면 true를 돌려주고 켜져 있던 오류 표시를 끈다', () => {
    const { result } = renderHook(() => useRequiredFieldsSave({ current: container }));
    act(() => {
      result.current.validate(true);
    });

    let isValid = false;
    act(() => {
      isValid = result.current.validate(false);
    });

    expect(isValid).toBe(true);
    expect(result.current.showErrors).toBe(false);
  });

  it('hideErrors로 오류 표시를 끈다', () => {
    const { result } = renderHook(() => useRequiredFieldsSave({ current: container }));
    act(() => {
      result.current.validate(true);
    });

    act(() => result.current.hideErrors());

    expect(result.current.showErrors).toBe(false);
  });
});
