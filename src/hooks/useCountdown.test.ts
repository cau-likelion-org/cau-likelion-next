// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useCountdown, { formatCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('시작 전에는 진행 중도 만료도 아니다', () => {
    const { result } = renderHook(() => useCountdown());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
  });

  it('시작하면 1초마다 남은 시간이 줄어든다', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => result.current.start(600));
    expect(result.current.remainingSeconds).toBe(600);
    expect(result.current.isRunning).toBe(true);

    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.remainingSeconds).toBe(597);
  });

  it('시간이 다 지나면 만료 상태가 된다', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => result.current.start(2));
    act(() => vi.advanceTimersByTime(2000));

    expect(result.current.remainingSeconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(true);
  });

  it('다시 시작하면 남은 시간을 처음부터 센다', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => result.current.start(2));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.start(600));

    expect(result.current.remainingSeconds).toBe(600);
    expect(result.current.isExpired).toBe(false);
  });

  it('멈추면 진행 중도 만료도 아닌 상태로 돌아간다', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => result.current.start(600));
    act(() => result.current.stop());

    expect(result.current.isRunning).toBe(false);
    expect(result.current.isExpired).toBe(false);
  });
});

describe('formatCountdown', () => {
  it('초를 mm:ss 형식으로 바꾼다', () => {
    expect(formatCountdown(600)).toBe('10:00');
    expect(formatCountdown(59)).toBe('00:59');
    expect(formatCountdown(0)).toBe('00:00');
  });
});
