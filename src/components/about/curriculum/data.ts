export interface CurriculumWeek {
  key: string;
  badge: string;
  title: string;
  content?: string;
}

export interface CurriculumTrack {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  items: string[];
  chips: string[];
  weeks: CurriculumWeek[];
}
