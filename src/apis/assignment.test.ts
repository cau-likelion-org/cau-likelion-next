import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  canSubmitAssignment,
  createAssignments,
  formatDueDate,
  formatSubmittedAt,
  resolveAssignmentActionLabel,
  updateIndividualDeadlines,
} from './assignment';
import { getAuthAxios } from './authAxios';

vi.mock('./authAxios', () => ({ getAuthAxios: vi.fn() }));

const TOKEN = { access: 'access', refresh: 'refresh' };
const DEADLINE = '2026-03-05T23:59:59';
const DEADLINE_MS = new Date(DEADLINE).getTime();
const GRACE_MS = 5 * 24 * 60 * 60 * 1000;

describe('formatDueDate', () => {
  it('연/월/일을 두 자리로 맞춰 보여준다', () => {
    expect(formatDueDate('2026-03-05T23:59:59')).toBe('2026/03/05');
  });

  it('날짜로 읽을 수 없는 값은 그대로 돌려준다', () => {
    expect(formatDueDate('마감 없음')).toBe('마감 없음');
  });
});

describe('formatSubmittedAt', () => {
  it('날짜 뒤에 시:분을 붙인다', () => {
    expect(formatSubmittedAt('2026-03-05T09:07:30')).toBe('2026/03/05 09:07');
  });

  it('날짜로 읽을 수 없는 값은 그대로 돌려준다', () => {
    expect(formatSubmittedAt('')).toBe('');
  });
});

describe('canSubmitAssignment', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('반려된 과제는 마감이 지나도 다시 제출할 수 있다', () => {
    vi.setSystemTime(DEADLINE_MS + GRACE_MS * 10);

    expect(canSubmitAssignment('REJECTED', DEADLINE)).toBe(true);
  });

  it.each(['APPROVED', 'LATE_SUBMITTED', 'MISSED'] as const)('%s 상태는 마감 전이라도 제출할 수 없다', (status) => {
    vi.setSystemTime(DEADLINE_MS - 1000);

    expect(canSubmitAssignment(status, DEADLINE)).toBe(false);
  });

  it('아직 내지 않은 과제는 마감 후 5일까지 지각 제출을 받는다', () => {
    vi.setSystemTime(DEADLINE_MS + GRACE_MS);
    expect(canSubmitAssignment('BEFORE_SUBMISSION', DEADLINE)).toBe(true);

    vi.setSystemTime(DEADLINE_MS + GRACE_MS + 1);
    expect(canSubmitAssignment('BEFORE_SUBMISSION', DEADLINE)).toBe(false);
  });

  it('승인 대기 중인 제출은 마감 시각까지만 수정할 수 있다', () => {
    vi.setSystemTime(DEADLINE_MS);
    expect(canSubmitAssignment('PENDING_REVIEW', DEADLINE)).toBe(true);

    vi.setSystemTime(DEADLINE_MS + 1);
    expect(canSubmitAssignment('PENDING_REVIEW', DEADLINE)).toBe(false);
  });
});

describe('resolveAssignmentActionLabel', () => {
  it('제출할 수 있는 과제가 없으면 버튼을 보여주지 않는다', () => {
    expect(resolveAssignmentActionLabel([])).toBeUndefined();
  });

  it('반려된 과제가 하나라도 있으면 재제출하기를 우선한다', () => {
    expect(
      resolveAssignmentActionLabel([
        { status: 'BEFORE_SUBMISSION', submitted: false },
        { status: 'REJECTED', submitted: true },
      ]),
    ).toBe('재제출하기');
  });

  it('아직 내지 않은 과제가 있으면 제출하기를 보여준다', () => {
    expect(
      resolveAssignmentActionLabel([
        { status: 'PENDING_REVIEW', submitted: true },
        { status: 'BEFORE_SUBMISSION', submitted: false },
      ]),
    ).toBe('제출하기');
  });

  it('전부 제출한 상태면 수정하기를 보여준다', () => {
    expect(resolveAssignmentActionLabel([{ status: 'PENDING_REVIEW', submitted: true }])).toBe('수정하기');
  });
});

describe('마감일 전송 형식', () => {
  const post = vi.fn();
  const patch = vi.fn();

  beforeEach(() => {
    post.mockResolvedValue({ data: {} });
    patch.mockResolvedValue({ data: [] });
    vi.mocked(getAuthAxios).mockReturnValue({ post, patch } as unknown as ReturnType<typeof getAuthAxios>);
  });

  afterEach(() => {
    post.mockReset();
    patch.mockReset();
  });

  it('과제 생성 시 날짜만 있는 마감일은 그날 23:59:59로 보낸다', async () => {
    await createAssignments(TOKEN, {
      week: 3,
      assignments: [
        { title: '과제 1', detail: '', endDate: '2026-03-05', type: 'URL' },
        { title: '과제 2', detail: '', endDate: '2026-03-06T18:00:00', type: 'FILE' },
      ],
    });

    const [path, body] = post.mock.calls[0];
    expect(path).toBe('/api/assignments');
    expect(body.assignments.map((item: { endDate: string }) => item.endDate)).toEqual([
      '2026-03-05T23:59:59',
      '2026-03-06T18:00:00',
    ]);
  });

  it('개별 마감일 변경도 같은 형식으로 보낸다', async () => {
    await updateIndividualDeadlines(TOKEN, 12, { memberIds: [1, 2], deadline: '2026-03-10' });

    expect(patch).toHaveBeenCalledWith('/api/assignments/12/deadline', {
      memberIds: [1, 2],
      deadline: '2026-03-10T23:59:59',
    });
  });
});
