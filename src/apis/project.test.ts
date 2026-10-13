import { describe, expect, it } from 'vitest';

import { getProjectThumbnail, getSortedProjectImages } from './project';

const image = (id: number, displayOrder: number, isMain = false) => ({
  id,
  imageUrl: `https://example.com/${id}.webp`,
  isMain,
  displayOrder,
});

describe('getProjectThumbnail', () => {
  it('대표로 지정된 이미지를 썸네일로 쓴다', () => {
    expect(getProjectThumbnail([image(1, 0), image(2, 1, true)])).toBe('https://example.com/2.webp');
  });

  it('대표 이미지가 없으면 노출 순서가 가장 앞선 이미지를 쓴다', () => {
    expect(getProjectThumbnail([image(1, 2), image(2, 0), image(3, 1)])).toBe('https://example.com/2.webp');
  });

  it('이미지가 없으면 빈 문자열을 돌려준다', () => {
    expect(getProjectThumbnail([])).toBe('');
  });
});

describe('getSortedProjectImages', () => {
  it('노출 순서대로 URL만 돌려주고 원본 배열은 바꾸지 않는다', () => {
    const images = [image(1, 2), image(2, 0), image(3, 1)];

    expect(getSortedProjectImages(images)).toEqual([
      'https://example.com/2.webp',
      'https://example.com/3.webp',
      'https://example.com/1.webp',
    ]);
    expect(images.map(({ id }) => id)).toEqual([1, 2, 3]);
  });
});
