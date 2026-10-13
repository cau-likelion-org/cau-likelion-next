import axios, { AxiosAdapter } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getAdminProjectList,
  getProjectList,
  getProjects,
  getProjectThumbnail,
  getSortedProjectImages,
} from './project';

vi.mock('src/lib/env', () => ({ env: { apiUrl: 'https://api.test' } }));

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

describe('프로젝트 목록 응답 변환', () => {
  const originalAdapter = axios.defaults.adapter;
  const adapter = vi.fn<AxiosAdapter>();

  const project = (id: number, generationNumber: number, category: string) => ({
    id,
    generationId: generationNumber,
    generationNumber,
    title: `프로젝트 ${id}`,
    category,
    stack: 'Next.js',
    tagline: `한 줄 소개 ${id}`,
    summary: `요약 ${id}`,
    teamName: '팀',
    startDate: '2026-03-01',
    endDate: '2026-06-01',
    banner: id === 1 ? '대상' : '',
    isExposed: id !== 3,
    images: [image(id * 10, 1), image(id * 10 + 1, 0, true)],
    links: [],
    members: [],
  });

  beforeEach(() => {
    axios.defaults.adapter = adapter;
    adapter.mockImplementation((config) =>
      Promise.resolve({
        data: [project(1, 14, 'HACKATHON'), project(2, 13, 'IDEATHON'), project(3, 14, 'ETC')],
        status: 200,
        statusText: '',
        headers: {},
        config,
      }),
    );
  });

  afterEach(() => {
    axios.defaults.adapter = originalAdapter;
    adapter.mockReset();
  });

  it('getProjects는 기수별로 묶고 화면에 쓰는 필드 이름으로 바꾼다', async () => {
    const grouped = await getProjects();

    expect(Object.keys(grouped).sort()).toEqual(['13', '14']);
    expect(grouped['14'].map(({ id }) => id)).toEqual([1, 3]);
    expect(grouped['14'][0]).toEqual({
      id: 1,
      title: '프로젝트 1',
      thumbnail: 'https://example.com/11.webp',
      subtitle: '한 줄 소개 1',
      description: '요약 1',
      category: '해커톤',
      banner: '대상',
      startDate: '2026-03-01',
    });
  });

  it('getProjectList는 이미지 배열 대신 대표 썸네일만 남긴다', async () => {
    const [first] = await getProjectList();

    expect(first.thumbnail).toBe('https://example.com/11.webp');
    expect(first).not.toHaveProperty('images');
    expect(first.isExposed).toBe(true);
  });

  it('getAdminProjectList도 같은 방식으로 썸네일을 채운다', async () => {
    const list = await getAdminProjectList();

    expect(list.map(({ thumbnail }) => thumbnail)).toEqual([
      'https://example.com/11.webp',
      'https://example.com/21.webp',
      'https://example.com/31.webp',
    ]);
  });
});
