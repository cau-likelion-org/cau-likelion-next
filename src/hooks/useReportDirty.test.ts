// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useReportDirty from './useReportDirty';

describe('useReportDirty', () => {
  afterEach(cleanup);

  it('변경 여부가 바뀔 때마다 알린다', () => {
    const onDirtyChange = vi.fn();
    const { rerender } = renderHook(({ isDirty }) => useReportDirty(isDirty, onDirtyChange), {
      initialProps: { isDirty: false },
    });

    rerender({ isDirty: true });

    expect(onDirtyChange.mock.calls).toEqual([[false], [true]]);
  });

  it('화면이 사라지면 변경사항이 없는 것으로 알린다', () => {
    const onDirtyChange = vi.fn();
    const { unmount } = renderHook(() => useReportDirty(true, onDirtyChange));

    unmount();

    expect(onDirtyChange).toHaveBeenLastCalledWith(false);
  });
});
