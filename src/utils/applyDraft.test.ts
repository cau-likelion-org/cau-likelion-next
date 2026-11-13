// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ApplyDraft, clearApplyDraft, deriveDraftKey, loadApplyDraft, saveApplyDraft } from './applyDraft';

const EMAIL = 'lion@example.com';
const EXPIRES_AT = '2027-03-09T23:59:59+09:00';
const BEFORE_EXPIRY = new Date('2027-03-05T12:00:00+09:00');

const DRAFT: ApplyDraft = {
  basic: {
    studentId: '20241234',
    major: '소프트웨어학부',
    grade: '2학년',
    semester: '3',
    enrollmentStatus: '재학',
    referral: '인스타그램',
    part: '프론트엔드',
    interviewSlots: ['2027-03-16T10:00'],
  },
  answers: { texts: { q1: '지원 동기' }, choices: { q3: ['c1'] } },
  hasFiles: true,
};

describe('applyDraft', () => {
  afterEach(() => localStorage.clear());

  it('같은 이메일·비밀번호로 저장한 지원서를 그대로 불러온다', async () => {
    const key = await deriveDraftKey(EMAIL, 'password1!');
    await saveApplyDraft(EMAIL, key, DRAFT, EXPIRES_AT);

    expect(await loadApplyDraft(EMAIL, await deriveDraftKey(EMAIL, 'password1!'), BEFORE_EXPIRY)).toEqual(DRAFT);
  });

  it('저장소에는 이메일과 답변이 평문으로 남지 않는다', async () => {
    await saveApplyDraft(EMAIL, await deriveDraftKey(EMAIL, 'password1!'), DRAFT, EXPIRES_AT);

    const stored = JSON.stringify({ ...localStorage });
    expect(stored).not.toContain(EMAIL);
    expect(stored).not.toContain('20241234');
    expect(stored).not.toContain('지원 동기');
  });

  it('다른 비밀번호로는 불러올 수 없다', async () => {
    await saveApplyDraft(EMAIL, await deriveDraftKey(EMAIL, 'password1!'), DRAFT, EXPIRES_AT);

    expect(await loadApplyDraft(EMAIL, await deriveDraftKey(EMAIL, 'other1!'), BEFORE_EXPIRY)).toBeNull();
  });

  it('만료된 저장본은 불러오지 않고 지운다', async () => {
    const key = await deriveDraftKey(EMAIL, 'password1!');
    await saveApplyDraft(EMAIL, key, DRAFT, EXPIRES_AT);

    expect(await loadApplyDraft(EMAIL, key, new Date('2027-03-10T00:00:00+09:00'))).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('지우면 더 이상 불러올 수 없다', async () => {
    const key = await deriveDraftKey(EMAIL, 'password1!');
    await saveApplyDraft(EMAIL, key, DRAFT, EXPIRES_AT);

    await clearApplyDraft(EMAIL);

    expect(await loadApplyDraft(EMAIL, key, BEFORE_EXPIRY)).toBeNull();
  });

  it('긴 답변도 저장하고 불러올 수 있다', async () => {
    const key = await deriveDraftKey(EMAIL, 'password1!');
    const longDraft = { ...DRAFT, answers: { texts: { q1: '가'.repeat(100_000) }, choices: {} } };

    expect(await saveApplyDraft(EMAIL, key, longDraft, EXPIRES_AT)).toBe(true);
    expect(await loadApplyDraft(EMAIL, key, BEFORE_EXPIRY)).toEqual(longDraft);
  });

  it('저장소에 쓸 수 없으면 false를 돌려준다', async () => {
    const key = await deriveDraftKey(EMAIL, 'password1!');
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    expect(await saveApplyDraft(EMAIL, key, DRAFT, EXPIRES_AT)).toBe(false);
    setItem.mockRestore();
  });
});
