// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook } from '@testing-library/react';

import usePageEngagementTracking from './usePageEngagementTracking';

const amplitude = vi.hoisted(() => ({
  track: vi.fn(),
  trackBeforeUnload: vi.fn(),
  getLastNextActionAt: () => 0,
}));

vi.mock('src/lib/amplitude', () => amplitude);

describe('usePageEngagementTracking', () => {
  beforeEach(() => {
    amplitude.track.mockClear();
    amplitude.trackBeforeUnload.mockClear();
  });

  afterEach(cleanup);

  it('페이지를 떠날 때(pagehide)는 이탈 이벤트를 trackBeforeUnload로 바로 보낸다', () => {
    renderHook(() => usePageEngagementTracking({ pagePath: '/project', exitEvent: 'Project Tab Page Exited' }));

    window.dispatchEvent(new Event('pagehide'));

    expect(amplitude.trackBeforeUnload).toHaveBeenCalledWith(
      'Project Tab Page Exited',
      expect.objectContaining({ page_path: '/project' }),
    );
    expect(amplitude.track).not.toHaveBeenCalled();
  });

  it('사이트 안에서 이동해 언마운트될 때는 이탈 이벤트를 track으로 보낸다', () => {
    const { unmount } = renderHook(() =>
      usePageEngagementTracking({ pagePath: '/project', exitEvent: 'Project Tab Page Exited' }),
    );

    unmount();

    expect(amplitude.track).toHaveBeenCalledWith(
      'Project Tab Page Exited',
      expect.objectContaining({ page_path: '/project' }),
    );
    expect(amplitude.trackBeforeUnload).not.toHaveBeenCalled();
  });
});
