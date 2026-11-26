export const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// createId()로 만든 로컬 전용 id(새로 추가된 항목)인지 판별 — 실제 백엔드 id는 항상 숫자 문자열
export const isNewItemId = (id: string) => Number.isNaN(Number(id));

interface SyncListSectionParams<TLocal extends { id: string }, TRequest, TResponse extends { id: number }> {
  currentItems: TLocal[];
  originalItems: TResponse[];
  toLocal: (response: TResponse) => TLocal;
  toRequest: (item: TLocal) => TRequest;
  create: (form: TRequest) => Promise<TResponse>;
  update: (id: number, form: TRequest) => Promise<TResponse>;
  remove: (id: number) => Promise<unknown>;
}

// 목록형 관리자 섹션(트랙/활동/FAQ) 공통 저장 로직 — 현재 화면 상태와 최초 조회 결과를 비교해
// 새로 추가된 항목은 생성, 실제로 값이 바뀐 기존 항목만 수정, 화면에서 지워진 기존 항목은 삭제 요청
// (다른 관리자가 그 사이 수정한 값을 안 바뀐 항목까지 덮어쓰지 않도록 변경분만 PUT)
export const syncListSection = async <TLocal extends { id: string }, TRequest, TResponse extends { id: number }>({
  currentItems,
  originalItems,
  toLocal,
  toRequest,
  create,
  update,
  remove,
}: SyncListSectionParams<TLocal, TRequest, TResponse>) => {
  const currentIds = new Set(currentItems.map((item) => item.id));
  const deletions = originalItems
    .filter((original) => !currentIds.has(String(original.id)))
    .map((original) => remove(original.id));

  const originalById = new Map(originalItems.map((original) => [String(original.id), original]));
  const changedItems = currentItems.filter((item) => {
    if (isNewItemId(item.id)) return true;
    const original = originalById.get(item.id);
    return !original || JSON.stringify(toLocal(original)) !== JSON.stringify(item);
  });
  const newItems = changedItems.filter((item) => isNewItemId(item.id));
  const updates = changedItems
    .filter((item) => !isNewItemId(item.id))
    .map((item) => update(Number(item.id), toRequest(item)));

  // 신규 항목은 서버가 매기는 id(=생성 순서)가 입력한 순서와 일치해야 해서 동시 요청 대신 순차 실행
  const createSequentially = async () => {
    for (const item of newItems) {
      await create(toRequest(item));
    }
  };

  await Promise.all([...deletions, ...updates, createSequentially()]);
};
