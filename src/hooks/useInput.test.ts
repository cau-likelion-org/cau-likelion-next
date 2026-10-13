// @vitest-environment jsdom
import { ChangeEvent } from 'react';
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import useInput from './useInput';

const changeTo = (value: string) => ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe('useInput', () => {
  afterEach(cleanup);

  it('입력값이 바뀌면 상태에 반영한다', () => {
    const { result } = renderHook(() => useInput('초기값'));

    act(() => result.current[1](changeTo('새 값')));

    expect(result.current[0]).toBe('새 값');
  });

  it('정규식에 맞지 않는 입력은 무시한다', () => {
    const { result } = renderHook(() => useInput('', /^\d*$/));

    act(() => result.current[1](changeTo('123')));
    act(() => result.current[1](changeTo('12a')));

    expect(result.current[0]).toBe('123');
  });

  it('setter로 값을 직접 바꿀 수 있다', () => {
    const { result } = renderHook(() => useInput('a'));

    act(() => result.current[2]('b'));

    expect(result.current[0]).toBe('b');
  });
});
