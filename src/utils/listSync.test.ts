import { describe, expect, it, vi } from 'vitest';

import { createId, isNewItemId, syncListSection } from './listSync';

interface Local {
  id: string;
  title: string;
}
interface Request {
  title: string;
}
interface Response {
  id: number;
  title: string;
}

const toLocal = (response: Response): Local => ({ id: String(response.id), title: response.title });
const toRequest = (item: Local): Request => ({ title: item.title });

const setup = (currentItems: Local[], originalItems: Response[]) => {
  const calls: string[] = [];
  const create = vi.fn(async (form: Request) => {
    calls.push(`create:${form.title}`);
    return { id: 0, ...form };
  });
  const update = vi.fn(async (id: number, form: Request) => ({ id, ...form }));
  const remove = vi.fn(async (id: number) => id);
  const run = () => syncListSection({ currentItems, originalItems, toLocal, toRequest, create, update, remove });
  return { calls, create, update, remove, run };
};

describe('isNewItemId', () => {
  it('createId로 만든 id는 새 항목으로 판별한다', () => {
    expect(isNewItemId(createId())).toBe(true);
  });

  it('숫자 문자열인 서버 id는 기존 항목으로 판별한다', () => {
    expect(isNewItemId('12')).toBe(false);
  });
});

describe('syncListSection', () => {
  it('화면에서 지워진 기존 항목만 삭제 요청한다', async () => {
    const { remove, run } = setup(
      [{ id: '1', title: 'A' }],
      [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
      ],
    );

    await run();

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith(2);
  });

  it('값이 바뀐 기존 항목만 수정 요청하고 안 바뀐 항목은 보내지 않는다', async () => {
    const { update, run } = setup(
      [
        { id: '1', title: 'A' },
        { id: '2', title: 'B2' },
      ],
      [
        { id: 1, title: 'A' },
        { id: 2, title: 'B' },
      ],
    );

    await run();

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(2, { title: 'B2' });
  });

  it('새 항목은 입력한 순서대로 하나씩 생성 요청한다', async () => {
    const { calls, create, update, run } = setup(
      [
        { id: createId(), title: 'first' },
        { id: '1', title: 'A' },
        { id: createId(), title: 'second' },
      ],
      [{ id: 1, title: 'A' }],
    );
    create.mockImplementationOnce(async (form: Request) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      calls.push(`create:${form.title}`);
      return { id: 0, ...form };
    });

    await run();

    expect(calls).toEqual(['create:first', 'create:second']);
    expect(update).not.toHaveBeenCalled();
  });
});
