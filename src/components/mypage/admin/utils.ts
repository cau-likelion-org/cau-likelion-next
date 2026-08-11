export const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// createId()로 만든 로컬 전용 id(새로 추가된 항목)인지 판별 — 실제 백엔드 id는 항상 숫자 문자열
export const isNewItemId = (id: string) => Number.isNaN(Number(id));

interface SyncListSectionParams<TLocal extends { id: string }, TRequest, TResponse extends { id: number }> {
  currentItems: TLocal[];
  originalItems: TResponse[];
  toRequest: (item: TLocal) => TRequest;
  create: (form: TRequest) => Promise<TResponse>;
  update: (id: number, form: TRequest) => Promise<TResponse>;
  remove: (id: number) => Promise<unknown>;
}

// 목록형 관리자 섹션(트랙/활동/FAQ) 공통 저장 로직 — 현재 화면 상태와 최초 조회 결과를 비교해
// 새로 추가된 항목은 생성, 남아있는 기존 항목은 수정, 화면에서 지워진 기존 항목은 삭제 요청
export const syncListSection = async <TLocal extends { id: string }, TRequest, TResponse extends { id: number }>({
  currentItems,
  originalItems,
  toRequest,
  create,
  update,
  remove,
}: SyncListSectionParams<TLocal, TRequest, TResponse>) => {
  const currentIds = new Set(currentItems.map((item) => item.id));
  const deletions = originalItems
    .filter((original) => !currentIds.has(String(original.id)))
    .map((original) => remove(original.id));
  const upserts = currentItems.map((item) =>
    isNewItemId(item.id) ? create(toRequest(item)) : update(Number(item.id), toRequest(item)),
  );
  await Promise.all([...deletions, ...upserts]);
};
