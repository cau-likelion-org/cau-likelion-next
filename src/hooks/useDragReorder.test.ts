// @vitest-environment jsdom
import { DragEvent } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useDragReorder, { moveItem } from './useDragReorder';

const dragEvent = () =>
  ({
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: { effectAllowed: 'none' },
  }) as unknown as DragEvent;

describe('moveItem', () => {
  it('항목을 앞에서 뒤로 옮긴다', () => {
    expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
  });

  it('항목을 뒤에서 앞으로 옮긴다', () => {
    expect(moveItem(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
  });

  it('원본 배열은 바꾸지 않는다', () => {
    const items = ['a', 'b', 'c'];
    moveItem(items, 0, 1);
    expect(items).toEqual(['a', 'b', 'c']);
  });
});

describe('useDragReorder', () => {
  afterEach(cleanup);

  it('핸들을 누른 항목만 드래그할 수 있다', () => {
    const { result } = renderHook(() => useDragReorder(['a', 'b'], vi.fn()));
    expect(result.current.getItemProps(0).draggable).toBe(false);

    act(() => result.current.getHandleProps(0).onMouseDown());

    expect(result.current.getItemProps(0).draggable).toBe(true);
    expect(result.current.getItemProps(1).draggable).toBe(false);
  });

  it('비활성이면 핸들을 눌러도 드래그할 수 없다', () => {
    const { result } = renderHook(() => useDragReorder(['a', 'b'], vi.fn(), true));

    act(() => result.current.getHandleProps(0).onMouseDown());

    expect(result.current.getItemProps(0).draggable).toBe(false);
  });

  it('다른 항목 위로 끌면 그 자리로 순서를 바꾼다', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragReorder(['a', 'b', 'c'], onReorder));

    act(() => result.current.getItemProps(0).onDragStart(dragEvent()));
    const over = dragEvent();
    act(() => result.current.getItemProps(2).onDragOver(over));

    expect(over.preventDefault).toHaveBeenCalled();
    expect(onReorder).toHaveBeenCalledWith(['b', 'c', 'a']);
    expect(result.current.dragIndex).toBe(2);
  });

  it('드래그 중이 아니면 순서를 바꾸지 않는다', () => {
    const onReorder = vi.fn();
    const { result } = renderHook(() => useDragReorder(['a', 'b'], onReorder));

    act(() => result.current.getItemProps(1).onDragOver(dragEvent()));

    expect(onReorder).not.toHaveBeenCalled();
  });

  it('드래그가 끝나면 상태를 초기화한다', () => {
    const { result } = renderHook(() => useDragReorder(['a', 'b'], vi.fn()));
    act(() => result.current.getHandleProps(0).onMouseDown());
    act(() => result.current.getItemProps(0).onDragStart(dragEvent()));

    act(() => result.current.getItemProps(0).onDragEnd(dragEvent()));

    expect(result.current.dragIndex).toBeNull();
    expect(result.current.getItemProps(0).draggable).toBe(false);
  });

  it('드래그 시작과 끝 이벤트를 바깥 목록으로 전달하지 않는다', () => {
    const { result } = renderHook(() => useDragReorder(['a', 'b'], vi.fn()));
    const start = dragEvent();
    const end = dragEvent();

    act(() => result.current.getItemProps(0).onDragStart(start));
    act(() => result.current.getItemProps(0).onDragEnd(end));

    expect(start.stopPropagation).toHaveBeenCalled();
    expect(end.stopPropagation).toHaveBeenCalled();
  });

  it('드래그 중이 아닌 목록은 지나가는 드래그를 바깥 목록에 넘긴다', () => {
    const { result } = renderHook(() => useDragReorder(['a', 'b'], vi.fn()));
    const over = dragEvent();

    act(() => result.current.getItemProps(1).onDragOver(over));

    expect(over.preventDefault).not.toHaveBeenCalled();
    expect(over.stopPropagation).not.toHaveBeenCalled();
  });
});
