import { describe, expect, it } from 'vitest';

import { getPaths, sortArchivingListDesc } from './archiving';

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
