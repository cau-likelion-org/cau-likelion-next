// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useListItems from './useListItems';

const ITEMS = [
  { id: 'a', title: '첫째' },
  { id: 'b', title: '둘째' },
];

describe('useListItems', () => {
  afterEach(cleanup);

  const setup = () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useListItems(ITEMS, onChange, () => ({ id: 'new', title: '' })));
    return { onChange, actions: result.current };
  };

  it('updateItem은 해당 id의 항목만 바꾼 새 배열을 넘긴다', () => {
    const { onChange, actions } = setup();

    actions.updateItem('b', { title: '수정됨' });

    expect(onChange).toHaveBeenCalledWith([
      { id: 'a', title: '첫째' },
      { id: 'b', title: '수정됨' },
    ]);
    expect(ITEMS[1].title).toBe('둘째');
  });

  it('removeItem은 해당 id의 항목을 뺀다', () => {
    const { onChange, actions } = setup();

    actions.removeItem('a');

    expect(onChange).toHaveBeenCalledWith([{ id: 'b', title: '둘째' }]);
  });

  it('addItem은 새 항목을 끝에 붙인다', () => {
    const { onChange, actions } = setup();

    actions.addItem();

    expect(onChange).toHaveBeenCalledWith([...ITEMS, { id: 'new', title: '' }]);
  });
});
