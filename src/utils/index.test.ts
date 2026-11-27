import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import {
  excludeCommonPart,
  formatFileSize,
  getPaths,
  getServerMessage,
  invertRecord,
  sortArchivingListDesc,
} from './index';

const axiosErrorWith = (data: unknown) =>
  new AxiosError('요청 실패', undefined, undefined, undefined, {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('getServerMessage', () => {
  it('응답 본문이 문자열이면 앞뒤 공백을 제거해 돌려준다', () => {
    expect(getServerMessage(axiosErrorWith('  이미 제출했습니다  '))).toBe('이미 제출했습니다');
  });

  it('응답 본문의 message 필드를 돌려준다', () => {
    expect(getServerMessage(axiosErrorWith({ message: '마감이 지났습니다' }))).toBe('마감이 지났습니다');
  });

  it('보여줄 메시지가 없으면 undefined를 돌려준다', () => {
    expect(getServerMessage(axiosErrorWith(''))).toBeUndefined();
    expect(getServerMessage(axiosErrorWith({ message: '   ' }))).toBeUndefined();
    expect(getServerMessage(axiosErrorWith({ message: 123 }))).toBeUndefined();
    expect(getServerMessage(axiosErrorWith(undefined))).toBeUndefined();
  });

  it('axios 에러가 아니면 undefined를 돌려준다', () => {
    expect(getServerMessage(new Error('네트워크 오류'))).toBeUndefined();
  });
});

describe('invertRecord', () => {
  it('키와 값을 뒤바꾼 객체를 만든다', () => {
    expect(invertRecord({ PASS: '합격', FAIL: '불합격' })).toEqual({ 합격: 'PASS', 불합격: 'FAIL' });
  });
});

describe('formatFileSize', () => {
  it('1MB 미만은 KB로 반올림해 표시하고 0KB로 내려가지 않는다', () => {
    expect(formatFileSize(500)).toBe('1KB');
    expect(formatFileSize(512 * 1024)).toBe('512KB');
  });

  it('1MB 이상은 MB로 소수점 한 자리까지 표시한다', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1MB');
    expect(formatFileSize(2.34 * 1024 * 1024)).toBe('2.3MB');
    expect(formatFileSize(30 * 1024 * 1024)).toBe('30MB');
  });
});

describe('excludeCommonPart', () => {
  it('"공통" 파트만 제외한다', () => {
    const parts = [{ name: '기획' }, { name: '공통' }, { name: '프론트엔드' }];
    expect(excludeCommonPart(parts)).toEqual([{ name: '기획' }, { name: '프론트엔드' }]);
  });
});

describe('sortArchivingListDesc', () => {
  it('기수를 문자열이 아닌 숫자 기준 내림차순으로 정렬한다', () => {
    const sorted = sortArchivingListDesc({ '9': [], '14': [], '10': [] });
    expect(sorted.map(([generation]) => generation)).toEqual(['14', '10', '9']);
  });
});

describe('getPaths', () => {
  it('종류에 맞는 파라미터 이름으로 모든 항목의 경로를 만든다', () => {
    const archiving = { '13': [{ id: 1 }, { id: 2 }], '14': [{ id: 7 }] } as unknown as Parameters<typeof getPaths>[0];

    expect(getPaths(archiving, 'project')).toEqual([
      { params: { project_id: '1' } },
      { params: { project_id: '2' } },
      { params: { project_id: '7' } },
    ]);
    expect(getPaths(archiving, 'gallery')[0]).toEqual({ params: { gallery_id: '1' } });
    expect(getPaths(archiving, 'session')[0]).toEqual({ params: { session_id: '1' } });
  });
});
