// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useOutsideClick from './useOutsideClick';

describe('useOutsideClick', () => {
  let inside: HTMLDivElement;
  let outside: HTMLDivElement;

  beforeEach(() => {
    inside = document.body.appendChild(document.createElement('div'));
    outside = document.body.appendChild(document.createElement('div'));
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const mouseDownOn = (element: HTMLElement) => element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

  it('영역 밖을 누르면 콜백을 부른다', () => {
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick({ current: inside }, onOutsideClick, true));

    mouseDownOn(outside);

    expect(onOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('영역 안을 누르면 콜백을 부르지 않는다', () => {
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick({ current: inside }, onOutsideClick, true));

    mouseDownOn(inside);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('비활성 상태에서는 감지하지 않는다', () => {
    const onOutsideClick = vi.fn();
    renderHook(() => useOutsideClick({ current: inside }, onOutsideClick, false));

    mouseDownOn(outside);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });

  it('언마운트되면 더 이상 감지하지 않는다', () => {
    const onOutsideClick = vi.fn();
    const { unmount } = renderHook(() => useOutsideClick({ current: inside }, onOutsideClick, true));

    unmount();
    mouseDownOn(outside);

    expect(onOutsideClick).not.toHaveBeenCalled();
  });
});
