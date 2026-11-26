// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ApplicantDetail } from './applicantMock';
import useApplicantFilter from './useApplicantFilter';

const applicant = (id: number, overrides: Partial<ApplicantDetail>) =>
  ({
    id,
    name: `지원자${id}`,
    studentId: `2024000${id}`,
    part: '기획',
    submissionStatus: 'ON_TIME',
    ...overrides,
  }) as ApplicantDetail;

const APPLICANTS = [
  applicant(1, { name: '김멋사', part: '기획' }),
  applicant(2, { name: '이사자', part: '디자인', submissionStatus: 'LATE' }),
  applicant(3, { name: '박사자', part: '기획', studentId: '20249999' }),
];

const RESULT_LABEL: Record<number, string> = { 1: '합격', 2: '불합격' };

const render = (pageSize = 10) =>
  renderHook(() => useApplicantFilter(APPLICANTS, { pageSize, getResultLabel: (target) => RESULT_LABEL[target.id] }));

describe('useApplicantFilter', () => {
  afterEach(cleanup);

  it('제출 상태·파트·결과로 거른다', () => {
    const { result } = render();

    act(() => result.current.changeStatusFilter('지각 제출'));
    expect(result.current.filtered.map((item) => item.id)).toEqual([2]);

    act(() => result.current.changeStatusFilter('전체'));
    act(() => result.current.changePartFilter('기획'));
    expect(result.current.filtered.map((item) => item.id)).toEqual([1, 3]);

    act(() => result.current.changeResultFilter('합격'));
    expect(result.current.filtered.map((item) => item.id)).toEqual([1]);
  });

  it('결과가 없는 지원자는 결과 필터에 걸리지 않는다', () => {
    const { result } = render();

    act(() => result.current.changeResultFilter('합격'));

    expect(result.current.filtered.map((item) => item.id)).toEqual([1]);
  });

  it('이름이나 학번으로 검색하고 앞뒤 공백은 무시한다', () => {
    const { result } = render();

    act(() => result.current.changeKeyword(' 사자 '));
    expect(result.current.filtered.map((item) => item.id)).toEqual([2, 3]);

    act(() => result.current.changeKeyword('9999'));
    expect(result.current.filtered.map((item) => item.id)).toEqual([3]);
  });

  it('페이지 크기만큼 나누고, 필터를 바꾸면 첫 페이지로 돌아간다', () => {
    const { result } = render(2);
    expect(result.current.totalPage).toBe(2);

    act(() => result.current.setPage(2));
    expect(result.current.pageItems.map((item) => item.id)).toEqual([3]);

    act(() => result.current.changePartFilter('디자인'));
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageItems.map((item) => item.id)).toEqual([2]);
  });

  it('지원자 목록이 줄어 보던 페이지가 사라지면 마지막 페이지를 보여준다', () => {
    const { result, rerender } = renderHook(
      ({ applicants }) => useApplicantFilter(applicants, { pageSize: 1, getResultLabel: () => undefined }),
      { initialProps: { applicants: APPLICANTS } },
    );

    act(() => result.current.setPage(3));
    rerender({ applicants: APPLICANTS.slice(0, 2) });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageItems.map((item) => item.id)).toEqual([2]);
  });
});
