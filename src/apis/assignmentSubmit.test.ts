import { AxiosError, AxiosResponse } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import {
  AssignmentBatchItem,
  SUBMIT_FAILED_MESSAGE,
  SUBMIT_UNVERIFIED_MESSAGE,
  resolveUnknownSubmissions,
  submissionFingerprint,
  submitAssignmentBatch,
} from './assignmentSubmit';

const linkItem = (id: string): AssignmentBatchItem => ({
  id,
  format: 'link',
  value: { files: [], keptFiles: [], link: ` https://example.com/${id} `, description: '' },
});

const fileItem = (id: string, files: File[]): AssignmentBatchItem => ({
  id,
  format: 'file',
  value: { files, keptFiles: [], link: '', description: '설명' },
});

// 서버가 응답한 실패 — 반영되지 않은 게 확실하다
const serverError = (message: string) =>
  new AxiosError('rejected', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 400,
    data: { message },
  } as AxiosResponse);

// 응답 없이 끊긴 실패 — 서버가 처리했는지 모른다
const timeoutError = () => new AxiosError('timeout', 'ECONNABORTED');

describe('submitAssignmentBatch', () => {
  it('모든 과제를 차례로 제출하고 성공 목록으로 돌려준다', async () => {
    const submit = vi.fn().mockResolvedValue({});

    const result = await submitAssignmentBatch([linkItem('1'), linkItem('2')], { upload: vi.fn(), submit });

    expect(result).toEqual({ succeededIds: ['1', '2'], failed: {}, unknownIds: [] });
    expect(submit).toHaveBeenCalledWith(1, { content: undefined, url: 'https://example.com/1', files: undefined });
  });

  it('한 건이 실패해도 나머지는 계속 제출하고, 실패 건만 서버 메시지와 함께 돌려준다', async () => {
    const submit = vi
      .fn()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(serverError('마감이 지났습니다'))
      .mockResolvedValueOnce({});

    const result = await submitAssignmentBatch([linkItem('1'), linkItem('2'), linkItem('3')], {
      upload: vi.fn(),
      submit,
    });

    expect(result.succeededIds).toEqual(['1', '3']);
    expect(result.failed).toEqual({ '2': '마감이 지났습니다' });
    expect(result.unknownIds).toEqual([]);
  });

  it('부분 실패 후 실패 건만 다시 넘기면 이미 성공한 과제는 다시 제출하지 않는다', async () => {
    const submit = vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(serverError('일시 오류'));
    const items = [linkItem('1'), linkItem('2')];

    const first = await submitAssignmentBatch(items, { upload: vi.fn(), submit });
    submit.mockClear().mockResolvedValue({});
    const retryItems = items.filter((item) => item.id in first.failed);
    await submitAssignmentBatch(retryItems, { upload: vi.fn(), submit });

    expect(submit).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledWith(2, expect.anything());
  });

  it('응답 없이 끊긴 제출은 실패가 아니라 결과 불명으로 분류한다', async () => {
    const submit = vi.fn().mockRejectedValue(timeoutError());

    const result = await submitAssignmentBatch([linkItem('1')], { upload: vi.fn(), submit });

    expect(result.unknownIds).toEqual(['1']);
    expect(result.failed).toEqual({});
  });

  it('업로드 단계에서 끊기면 제출 요청 전이므로 결과 불명이 아니라 실패로 본다', async () => {
    const upload = vi.fn().mockRejectedValue(timeoutError());
    const submit = vi.fn();

    const result = await submitAssignmentBatch([fileItem('1', [new File(['a'], 'a.pdf')])], { upload, submit });

    expect(submit).not.toHaveBeenCalled();
    expect(result.failed).toEqual({ '1': SUBMIT_FAILED_MESSAGE });
    expect(result.unknownIds).toEqual([]);
  });

  it('재시도 때 이미 올라간 파일은 다시 업로드하지 않는다', async () => {
    const file = new File(['a'], 'a.pdf');
    const upload = vi.fn().mockResolvedValue('https://storage/a.pdf');
    const submit = vi.fn().mockRejectedValueOnce(serverError('일시 오류')).mockResolvedValueOnce({});
    const uploadCache = new Map<File, string>();

    await submitAssignmentBatch([fileItem('1', [file])], { upload, submit, uploadCache });
    await submitAssignmentBatch([fileItem('1', [file])], { upload, submit, uploadCache });

    expect(upload).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenLastCalledWith(1, {
      content: '설명',
      url: undefined,
      files: [{ fileUrl: 'https://storage/a.pdf', originalFilename: 'a.pdf' }],
    });
  });
});

describe('resolveUnknownSubmissions', () => {
  it('재조회한 최신 제출이 제출 전과 다르면 서버에 반영된 것으로 본다', () => {
    const result = resolveUnknownSubmissions(['1'], { '1': null }, { '1': '10:2026-03-05T10:00:00' });

    expect(result).toEqual({ appliedIds: ['1'], failed: {} });
  });

  it('수정 제출처럼 id가 같아도 제출 시각이 바뀌었으면 반영된 것으로 본다', () => {
    const result = resolveUnknownSubmissions(
      ['1'],
      { '1': '10:2026-03-05T10:00:00' },
      { '1': '10:2026-03-05T11:00:00' },
    );

    expect(result.appliedIds).toEqual(['1']);
  });

  it('최신 제출이 그대로면 반영되지 않은 것으로 보고 재시도 대상으로 남긴다', () => {
    const result = resolveUnknownSubmissions(
      ['1'],
      { '1': '10:2026-03-05T10:00:00' },
      { '1': '10:2026-03-05T10:00:00' },
    );

    expect(result).toEqual({ appliedIds: [], failed: { '1': SUBMIT_FAILED_MESSAGE } });
  });

  it('이력 재조회에 실패하면 추측하지 않고 확인 불가로 남긴다', () => {
    const result = resolveUnknownSubmissions(['1'], { '1': null }, null);

    expect(result).toEqual({ appliedIds: [], failed: { '1': SUBMIT_UNVERIFIED_MESSAGE } });
  });
});

describe('submissionFingerprint', () => {
  it('제출이 없으면 null, 있으면 id와 제출 시각을 묶는다', () => {
    expect(submissionFingerprint(undefined)).toBeNull();
    expect(submissionFingerprint({ id: 10, submittedAt: '2026-03-05T10:00:00' })).toBe('10:2026-03-05T10:00:00');
  });
});
