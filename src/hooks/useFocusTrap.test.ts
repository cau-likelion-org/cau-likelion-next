// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useFocusTrap from './useFocusTrap';

describe('useFocusTrap', () => {
  let opener: HTMLButtonElement;
  let container: HTMLDivElement;

  beforeEach(() => {
    opener = document.body.appendChild(document.createElement('button'));
    container = document.body.appendChild(document.createElement('div'));
    container.tabIndex = -1;
    container.innerHTML =
      '<button id="first">확인</button><button disabled>비활성</button><button id="last">취소</button>';
    opener.focus();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  const first = () => container.querySelector<HTMLButtonElement>('#first')!;
  const last = () => container.querySelector<HTMLButtonElement>('#last')!;
  const press = (key: string, shiftKey = false) => {
    const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
    container.dispatchEvent(event);
    return event;
  };

  it('열리면 첫 번째 포커스 가능한 요소로 포커스를 옮긴다', () => {
    renderHook(() => useFocusTrap({ current: container }, vi.fn()));

    expect(document.activeElement).toBe(first());
  });

  it('마지막 요소에서 Tab을 누르면 첫 요소로 돌아간다', () => {
    renderHook(() => useFocusTrap({ current: container }, vi.fn()));
    last().focus();

    const event = press('Tab');

    expect(document.activeElement).toBe(first());
    expect(event.defaultPrevented).toBe(true);
  });

  it('첫 요소에서 Shift+Tab을 누르면 마지막 요소로 간다', () => {
    renderHook(() => useFocusTrap({ current: container }, vi.fn()));

    press('Tab', true);

    expect(document.activeElement).toBe(last());
  });

  it('중간 이동은 브라우저 기본 동작에 맡긴다', () => {
    renderHook(() => useFocusTrap({ current: container }, vi.fn()));

    const event = press('Tab');

    expect(event.defaultPrevented).toBe(false);
  });

  it('포커스 가능한 요소가 없으면 컨테이너에 포커스를 가둔다', () => {
    container.innerHTML = '<p>내용</p>';
    renderHook(() => useFocusTrap({ current: container }, vi.fn()));

    const event = press('Tab');

    expect(document.activeElement).toBe(container);
    expect(event.defaultPrevented).toBe(true);
  });

  it('Escape를 누르면 닫기 콜백을 부른다', () => {
    const onClose = vi.fn();
    renderHook(() => useFocusTrap({ current: container }, onClose));

    press('Escape');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('닫히면 열기 전에 포커스가 있던 요소로 되돌린다', () => {
    const { unmount } = renderHook(() => useFocusTrap({ current: container }, vi.fn()));

    unmount();

    expect(document.activeElement).toBe(opener);
  });
});
