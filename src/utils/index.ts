import axios from 'axios';
import { ArchivingArrayType, IGalleryData, IProjectData, ISessionData } from '@@types/request';
import { COMMON_PART_NAME } from '@utils/constant';

// 서버가 내려주는 실패 사유(중복, 형식 오류, 마감 초과 등)를 그대로 보여줄 때 사용
export const getServerMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return undefined;
  const data: unknown = error.response?.data;
  if (typeof data === 'string') return data.trim() || undefined;
  const message = (data as { message?: unknown } | undefined)?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
};

export const toDateString = (date?: Date, formatter = '-') => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return year + formatter + month + formatter + day;
};

export const invertRecord = <K extends string, V extends string>(record: Record<K, V>) =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [value, key])) as Record<V, K>;

export const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, '/');

export const formatDateTime = (value: string) => `${formatDate(value)} ${value.slice(11, 16)}`;

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const pad2 = (value: number) => String(value).padStart(2, '0');

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

// 2027.03.08(월) 21:34 형태. 접속한 기기의 시간대와 관계없이 한국 시간으로 표시한다
export const toDateTimeLabel = (date: Date) => {
  const kst = new Date(date.getTime() + KST_OFFSET_MS);
  return (
    `${kst.getUTCFullYear()}.${pad2(kst.getUTCMonth() + 1)}.${pad2(kst.getUTCDate())}(${DAY_LABELS[kst.getUTCDay()]}) ` +
    `${pad2(kst.getUTCHours())}:${pad2(kst.getUTCMinutes())}`
  );
};

const toMinutesOfDay = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTimeOfDay = (minutes: number) => `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;

export const formatInterviewSlots = (slots: string[], unitMinutes: number) => {
  const ranges: { date: string; start: number; end: number }[] = [];
  [...slots].sort().forEach((slot) => {
    const [date, time] = slot.split('T');
    const start = toMinutesOfDay(time);
    const last = ranges[ranges.length - 1];
    if (last && last.date === date && last.end === start) last.end = start + unitMinutes;
    else ranges.push({ date, start, end: start + unitMinutes });
  });
  return ranges
    .map(({ date, start, end }) => {
      const [year, month, day] = date.split('-').map(Number);
      const weekday = DAY_LABELS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
      return `${month}/${day}(${weekday}) ${toTimeOfDay(start)}-${toTimeOfDay(end)}`;
    })
    .join(', ');
};

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

export const sortArchivingListDesc = <T extends IGalleryData | IProjectData>(
  data: ArchivingArrayType<T>,
): Array<[string, T[]]> => {
  return Object.entries(data).sort(([a], [b]) => Number(b) - Number(a));
};

interface IPath {
  params: IParams;
}
type IParams = Record<'project_id' | 'session_id' | 'gallery_id', string>;

export function getPaths<T extends IProjectData | IGalleryData | ISessionData>(
  archivingArray: ArchivingArrayType<T>,
  type: 'project' | 'session' | 'gallery',
) {
  const paths = [] as IPath[];

  let key: 'project_id' | 'session_id' | 'gallery_id';
  if (type === 'project') key = 'project_id';
  if (type === 'session') key = 'session_id';
  if (type === 'gallery') key = 'gallery_id';

  Object.values(archivingArray).forEach((archivings) => {
    archivings.forEach((archiving) => {
      const obj = {} as IParams;
      obj[key] = String(archiving.id);
      paths.push({ params: obj });
    });
  });
  return paths;
}
