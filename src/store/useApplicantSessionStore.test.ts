import { beforeEach, describe, expect, it } from 'vitest';

import useApplicantSessionStore, { ApplicantSession } from './useApplicantSessionStore';

const SESSION = {
  profile: { name: '홍길동', phone: '010-1234-5678', email: 'lion@example.com' },
  draftKey: {} as CryptoKey,
} satisfies ApplicantSession;

describe('useApplicantSessionStore', () => {
  beforeEach(() => {
    useApplicantSessionStore.setState({ session: null, isDraftChosen: false });
  });

  it('저장본을 고른 뒤 다시 로그인하면 다시 고르게 한다', () => {
    useApplicantSessionStore.getState().setSession(SESSION);
    useApplicantSessionStore.getState().chooseDraft();
    expect(useApplicantSessionStore.getState().isDraftChosen).toBe(true);

    useApplicantSessionStore.getState().setSession(SESSION);
    expect(useApplicantSessionStore.getState().isDraftChosen).toBe(false);
  });

  it('세션을 지우면 고른 상태도 함께 지운다', () => {
    useApplicantSessionStore.getState().setSession(SESSION);
    useApplicantSessionStore.getState().chooseDraft();
    useApplicantSessionStore.getState().clearSession();

    expect(useApplicantSessionStore.getState()).toMatchObject({ session: null, isDraftChosen: false });
  });
});
