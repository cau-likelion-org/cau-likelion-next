// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { consumeGoogleLoginRedirect, redirectToGoogleLogin } from './googleOAuth';

vi.mock('src/lib/env', () => ({ env: { googleClientId: undefined } }));

const NONCE_KEY = 'googleOAuthNonce';
const idTokenWithNonce = (nonce: string) => `header.${btoa(JSON.stringify({ nonce }))}.signature`;

describe('consumeGoogleLoginRedirect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    window.history.replaceState(null, '', '/login');
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('리다이렉트로 돌아온 게 아니면 null을 돌려준다', () => {
    expect(consumeGoogleLoginRedirect()).toBeNull();
  });

  it('로그인과 무관한 해시는 무시한다', () => {
    window.location.hash = '#section';

    expect(consumeGoogleLoginRedirect()).toBeNull();
    expect(window.location.hash).toBe('#section');
  });

  it('저장해 둔 nonce와 토큰의 nonce가 같으면 idToken을 돌려준다', () => {
    const idToken = idTokenWithNonce('nonce-1');
    sessionStorage.setItem(NONCE_KEY, 'nonce-1');
    window.location.hash = `#id_token=${idToken}`;

    expect(consumeGoogleLoginRedirect()).toEqual({ idToken });
  });

  it('처리한 뒤에는 nonce와 주소의 해시를 지운다', () => {
    sessionStorage.setItem(NONCE_KEY, 'nonce-1');
    window.location.hash = `#id_token=${idTokenWithNonce('nonce-1')}`;

    consumeGoogleLoginRedirect();

    expect(sessionStorage.getItem(NONCE_KEY)).toBeNull();
    expect(window.location.hash).toBe('');
  });

  it('nonce가 다르면 위조된 응답으로 보고 거부한다', () => {
    sessionStorage.setItem(NONCE_KEY, 'nonce-1');
    window.location.hash = `#id_token=${idTokenWithNonce('nonce-2')}`;

    expect(consumeGoogleLoginRedirect()).toEqual({ error: 'invalid_token' });
  });

  it('저장해 둔 nonce가 없으면 거부한다', () => {
    window.location.hash = `#id_token=${idTokenWithNonce('nonce-1')}`;

    expect(consumeGoogleLoginRedirect()).toEqual({ error: 'invalid_token' });
  });

  it('해석할 수 없는 토큰은 거부한다', () => {
    sessionStorage.setItem(NONCE_KEY, 'nonce-1');
    window.location.hash = '#id_token=not-a-jwt';

    expect(consumeGoogleLoginRedirect()).toEqual({ error: 'invalid_token' });
  });

  it('구글이 에러를 돌려주면 그 에러를 그대로 전달한다', () => {
    sessionStorage.setItem(NONCE_KEY, 'nonce-1');
    window.location.hash = '#error=access_denied';

    expect(consumeGoogleLoginRedirect()).toEqual({ error: 'access_denied' });
  });

  it('같은 tick 안의 두 번째 호출은 첫 결과를 재사용하고, 다음 tick부터는 재사용하지 않는다', () => {
    const idToken = idTokenWithNonce('nonce-1');
    sessionStorage.setItem(NONCE_KEY, 'nonce-1');
    window.location.hash = `#id_token=${idToken}`;

    expect(consumeGoogleLoginRedirect()).toEqual({ idToken });
    expect(consumeGoogleLoginRedirect()).toEqual({ idToken });

    vi.runAllTimers();

    expect(consumeGoogleLoginRedirect()).toBeNull();
  });
});

describe('redirectToGoogleLogin', () => {
  it('클라이언트 ID가 없으면 이동하지 않고 에러만 남긴다', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    sessionStorage.clear();

    redirectToGoogleLogin();

    expect(error).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(NONCE_KEY)).toBeNull();
    error.mockRestore();
  });
});
