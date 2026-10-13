// @vitest-environment jsdom
import { FocusEvent, KeyboardEvent } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useListboxSelect from './useListboxSelect';

const OPTIONS = ['전체', '13기', '14기'];

describe('useListboxSelect', () => {
  const onOpen = vi.fn();
  const onClose = vi.fn();
  const onSelect = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const setup = (isOpen: boolean, value = '전체') => {
    const hook = renderHook(() => useListboxSelect({ isOpen, options: OPTIONS, value, onOpen, onClose, onSelect }));
    act(() => {
      vi.runAllTimers();
    });
    return hook;
  };

  const press = (result: ReturnType<typeof setup>['result'], key: string) => {
    const event = { key, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    act(() => result.current.handleKeyDown(event as unknown as KeyboardEvent));
    return event;
  };

  it('현재 선택된 값의 위치에서 시작한다', () => {
    const { result } = setup(true, '14기');

    expect(result.current.activeIndex).toBe(2);
  });

  it('선택된 값이 목록에 없으면 첫 항목에서 시작한다', () => {
    const { result } = setup(true, '없는 값');

    expect(result.current.activeIndex).toBe(0);
  });

  it.each(['ArrowDown', 'ArrowUp', 'Enter', ' '])('닫힌 상태에서 %s 키를 누르면 연다', (key) => {
    const { result } = setup(false);

    const event = press(result, key);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('닫힌 상태에서 다른 키는 무시한다', () => {
    const { result } = setup(false);

    press(result, 'a');
    press(result, 'Escape');

    expect(onOpen).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('위아래 화살표로 이동하되 목록 끝을 넘어가지 않는다', () => {
    const { result } = setup(true);

    press(result, 'ArrowUp');
    expect(result.current.activeIndex).toBe(0);

    press(result, 'ArrowDown');
    press(result, 'ArrowDown');
    press(result, 'ArrowDown');
    expect(result.current.activeIndex).toBe(2);
  });

  it('Home과 End로 처음과 끝으로 이동한다', () => {
    const { result } = setup(true);

    press(result, 'End');
    expect(result.current.activeIndex).toBe(2);

    press(result, 'Home');
    expect(result.current.activeIndex).toBe(0);
  });

  it.each(['Enter', ' '])('%s 키로 활성 항목을 선택하고 닫는다', (key) => {
    const { result } = setup(true);
    press(result, 'ArrowDown');

    press(result, key);

    expect(onSelect).toHaveBeenCalledWith('13기');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Escape로 선택 없이 닫는다', () => {
    const { result } = setup(true);

    press(result, 'Escape');

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('목록 조작 키는 바깥으로 전파하지 않는다', () => {
    const { result } = setup(true);

    expect(press(result, 'ArrowDown').stopPropagation).toHaveBeenCalled();
    expect(press(result, 'a').stopPropagation).not.toHaveBeenCalled();
  });

  it('selectOption은 선택을 알리고 닫은 뒤 트리거로 포커스를 돌려준다', () => {
    const { result } = setup(true);
    const trigger = document.body.appendChild(document.createElement('div'));
    trigger.tabIndex = 0;
    (result.current.triggerRef as { current: HTMLDivElement | null }).current = trigger;

    act(() => result.current.selectOption('14기', 2));

    expect(onSelect).toHaveBeenCalledWith('14기');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(result.current.activeIndex).toBe(2);
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('포커스가 영역 밖으로 나가면 닫는다', () => {
    const { result } = setup(true);
    const wrapper = document.createElement('div');
    const inner = wrapper.appendChild(document.createElement('button'));
    (result.current.wrapperRef as { current: HTMLDivElement | null }).current = wrapper;

    act(() => result.current.handleBlur({ relatedTarget: inner } as unknown as FocusEvent));
    expect(onClose).not.toHaveBeenCalled();

    act(() => result.current.handleBlur({ relatedTarget: document.body } as unknown as FocusEvent));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
