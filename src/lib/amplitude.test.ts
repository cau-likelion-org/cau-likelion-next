// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({
  init: vi.fn(),
  track: vi.fn(),
  flush: vi.fn(),
  setTransport: vi.fn(),
}));

vi.mock('@amplitude/analytics-browser', () => sdk);
vi.mock('src/lib/env', () => ({ env: { amplitudeApiKey: 'test-key' } }));

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
};

const loadReadyAmplitude = async () => {
  const amplitude = await import('./amplitude');
  amplitude.track('Login Failed', { login_method: 'google' });
  await vi.dynamicImportSettled();
  Object.values(sdk).forEach((fn) => fn.mockClear());
  return amplitude;
};

describe('trackBeforeUnload', () => {
  beforeEach(() => {
    vi.resetModules();
    Object.values(sdk).forEach((fn) => fn.mockClear());
  });

  it('SDK가 로드돼 있으면 beacon으로 바꾼 뒤 대기열을 바로 전송한다', async () => {
    const { trackBeforeUnload } = await loadReadyAmplitude();

    trackBeforeUnload('Login Started', { button_label: '구글 로그인' });

    expect(sdk.setTransport).toHaveBeenCalledWith('beacon');
    expect(sdk.track).toHaveBeenCalledWith('Login Started', { button_label: '구글 로그인' });
    expect(sdk.flush).toHaveBeenCalledOnce();
    expect(sdk.track.mock.invocationCallOrder[0]).toBeLessThan(sdk.flush.mock.invocationCallOrder[0]);
  });

  it('페이지가 다시 보이면 fetch 전송으로 되돌린다', async () => {
    const { trackBeforeUnload } = await loadReadyAmplitude();
    trackBeforeUnload('Login Started', { button_label: '구글 로그인' });

    setVisibility('visible');

    expect(sdk.setTransport).toHaveBeenLastCalledWith('fetch');
  });
});
