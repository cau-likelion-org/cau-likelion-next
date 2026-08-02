export const ROADMAP_MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export interface RoadmapRow {
  label: string;
  leftPercent: number;
  widthPercent: number;
}

export const ROADMAP_ROWS: RoadmapRow[] = [
  { label: '리크루팅', leftPercent: 0, widthPercent: 16.67 },
  { label: '세션', leftPercent: 16.67, widthPercent: 75 },
  { label: '아이디어톤', leftPercent: 33.33, widthPercent: 16.67 },
  { label: '해커톤', leftPercent: 52.61, widthPercent: 16.67 },
  { label: '중커톤', leftPercent: 72.39, widthPercent: 16.67 },
];
