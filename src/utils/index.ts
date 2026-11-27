import axios from 'axios';
import { COMMON_PART_NAME } from '@utils/constant';

// 서버가 내려주는 실패 사유(중복, 형식 오류, 마감 초과 등)를 그대로 보여줄 때 사용
export const getServerMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return undefined;
  const data: unknown = error.response?.data;
  if (typeof data === 'string') return data.trim() || undefined;
  const message = (data as { message?: unknown } | undefined)?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
};

export const invertRecord = <K extends string, V extends string>(record: Record<K, V>) =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [value, key])) as Record<V, K>;

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;
// 1MB 미만은 KB, 이상은 MB로 소수점 한 자리까지 표시한다 (2.0MB → 2MB)
export const formatFileSize = (bytes: number) => {
  if (bytes < BYTES_PER_MB) return `${Math.max(1, Math.round(bytes / BYTES_PER_KB))}KB`;
  return `${Number((bytes / BYTES_PER_MB).toFixed(1))}MB`;
};

// 갤러리 게시물 파트 선택지에만 있는 "공통"은 관리자 화면의 파트 목록·드롭다운에서는 제외한다
export const excludeCommonPart = <T extends { name: string }>(parts: T[]) =>
  parts.filter((part) => part.name !== COMMON_PART_NAME);
