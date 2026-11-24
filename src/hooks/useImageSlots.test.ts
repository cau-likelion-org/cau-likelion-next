// @vitest-environment jsdom
import { ChangeEvent, DragEvent } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useImageSlots from './useImageSlots';

const fileEvent = (...names: string[]) =>
  ({
    target: { files: names.map((name) => new File(['x'], name)), value: 'C:\\fakepath' },
  }) as unknown as ChangeEvent<HTMLInputElement>;

const dragEvent = () =>
  ({
    preventDefault: vi.fn(),
    dataTransfer: { setData: vi.fn(), effectAllowed: '', dropEffect: '' },
  }) as unknown as DragEvent<HTMLElement>;

const renderSlots = (initialImages: (string | null)[] = [null, null, null, null], initialFeaturedIndex = 0) =>
  renderHook(() => useImageSlots({ maxCount: 4, initialImages, initialFeaturedIndex }));

describe('useImageSlots', () => {
  beforeEach(() => {
    let count = 0;
    vi.stubGlobal('URL', { createObjectURL: () => `blob:${++count}`, revokeObjectURL: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('고른 칸부터 빈 칸을 차례로 채우고, 첫 업로드면 처음 채운 칸을 대표 이미지로 정한다', async () => {
    const { result } = renderSlots();

    await act(() => result.current.addFiles(1, fileEvent('a.png', 'b.png')));

    expect(result.current.images).toEqual([null, 'blob:1', 'blob:2', null]);
    expect(result.current.imageFiles.map((file) => file?.name ?? null)).toEqual([null, 'a.png', 'b.png', null]);
    expect(result.current.featuredIndex).toBe(1);
  });

  it('빈 칸보다 많은 파일은 남는 만큼만 넣는다', async () => {
    const { result } = renderSlots(['u0', 'u1', 'u2', null]);

    await act(() => result.current.addFiles(0, fileEvent('a.png', 'b.png')));

    expect(result.current.images).toEqual(['u0', 'u1', 'u2', 'blob:1']);
    expect(result.current.featuredIndex).toBe(0);
  });

  it('prepareFile이 있으면 변환한 파일을 저장한다', async () => {
    const prepareFile = vi.fn(async (file: File) => new File(['y'], `resized-${file.name}`));
    const { result } = renderHook(() =>
      useImageSlots({ maxCount: 4, initialImages: [null, null, null, null], initialFeaturedIndex: 0, prepareFile }),
    );

    await act(() => result.current.addFiles(0, fileEvent('a.png')));

    expect(result.current.imageFiles[0]?.name).toBe('resized-a.png');
  });

  it('파일 변환을 기다리는 동안 또 고른 파일도 덮어쓰지 않고 빈 칸에 넣는다', async () => {
    const pending: Record<string, (file: File) => void> = {};
    const prepareFile = (file: File) => new Promise<File>((resolve) => (pending[file.name] = resolve));
    const { result } = renderHook(() =>
      useImageSlots({ maxCount: 4, initialImages: [null, null, null, null], initialFeaturedIndex: 0, prepareFile }),
    );

    let first: Promise<void> = Promise.resolve();
    let second: Promise<void> = Promise.resolve();
    act(() => {
      first = result.current.addFiles(0, fileEvent('a.png', 'b.png'));
    });
    act(() => {
      second = result.current.addFiles(0, fileEvent('c.png'));
    });

    await act(async () => {
      pending['c.png'](new File(['x'], 'c.png'));
      await second;
    });
    await act(async () => {
      pending['a.png'](new File(['x'], 'a.png'));
      pending['b.png'](new File(['x'], 'b.png'));
      await first;
    });

    expect(result.current.imageFiles.map((file) => file?.name ?? null)).toEqual(['c.png', 'a.png', 'b.png', null]);
    expect(result.current.featuredIndex).toBe(0);
  });

  it('파일 변환 중에는 준비 중 상태를 알린다', async () => {
    let finish: (file: File) => void = () => undefined;
    const prepareFile = () => new Promise<File>((resolve) => (finish = resolve));
    const { result } = renderHook(() =>
      useImageSlots({ maxCount: 4, initialImages: [null, null, null, null], initialFeaturedIndex: 0, prepareFile }),
    );

    let pending: Promise<void> = Promise.resolve();
    act(() => {
      pending = result.current.addFiles(0, fileEvent('a.png'));
    });
    expect(result.current.isPreparing).toBe(true);

    await act(async () => {
      finish(new File(['x'], 'a.png'));
      await pending;
    });
    expect(result.current.isPreparing).toBe(false);
  });

  it('삭제하면 뒤 이미지를 앞으로 당기고 대표 이미지 위치를 맞춘다', () => {
    const { result } = renderSlots(['u0', 'u1', 'u2', null], 2);

    act(() => result.current.removeImage(0));

    expect(result.current.images).toEqual(['u1', 'u2', null, null]);
    expect(result.current.featuredIndex).toBe(1);
  });

  it('대표 이미지를 삭제하면 남은 첫 이미지를 대표로 정한다', () => {
    const { result } = renderSlots(['u0', 'u1', null, null], 1);

    act(() => result.current.removeImage(1));

    expect(result.current.images).toEqual(['u0', null, null, null]);
    expect(result.current.featuredIndex).toBe(0);
  });

  it('드래그로 순서를 바꾸면 대표 이미지도 함께 옮겨진다', () => {
    const { result } = renderSlots(['u0', 'u1', 'u2', null], 0);

    act(() => result.current.thumbnailProps(0).onDragStart(dragEvent()));
    act(() => result.current.thumbnailProps(2).onDragOver(dragEvent()));
    expect(result.current.isDropTarget(2)).toBe(true);
    act(() => result.current.thumbnailProps(2).onDrop(dragEvent()));

    expect(result.current.images).toEqual(['u1', 'u2', 'u0', null]);
    expect(result.current.featuredIndex).toBe(2);
    expect(result.current.isDragging(0)).toBe(false);
  });
});
