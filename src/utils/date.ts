export const toDateString = (date?: Date, formatter = '-') => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return year + formatter + month + formatter + day;
};

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

export const toMinutesOfDay = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const toTimeOfDay = (minutes: number) => `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;

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
