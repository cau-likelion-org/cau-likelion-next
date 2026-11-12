export const TEMPLATE_VARIABLES = {
  name: '{이름}',
  interviewAt: '{면접 일시}',
  interviewPlace: '{면접 대기 장소}',
} as const;

export interface TemplateValues {
  name: string;
  interviewAt?: string;
  interviewPlace?: string;
}

export const fillResultTemplate = (template: string, values: TemplateValues) =>
  template
    .split(TEMPLATE_VARIABLES.name)
    .join(values.name)
    .split(TEMPLATE_VARIABLES.interviewAt)
    .join(values.interviewAt ?? '')
    .split(TEMPLATE_VARIABLES.interviewPlace)
    .join(values.interviewPlace ?? '');

export interface InterviewPeriod {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  unitMinutes: number;
}

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const INTERVIEW_WARNING = {
  notSelected: '지원자가 선택하지 않은 시간입니다',
  outOfPeriod: '면접 기간 밖의 일시입니다',
  duplicated: (count: number) => `같은 일시에 ${count}명이 배정되었습니다`,
};

export const getInterviewWarnings = ({
  date,
  time,
  selectedSlots,
  period,
  sameTimeCount,
}: {
  date: string;
  time: string;
  selectedSlots: string[];
  period: InterviewPeriod;
  sameTimeCount: number;
}) => {
  if (!date || !time) return [];
  const minutes = toMinutes(time);
  const warnings: string[] = [];

  const isSelected = selectedSlots.some((slot) => {
    const [slotDate, slotTime] = slot.split('T');
    const start = toMinutes(slotTime);
    return slotDate === date && minutes >= start && minutes < start + period.unitMinutes;
  });
  if (!isSelected) warnings.push(INTERVIEW_WARNING.notSelected);

  const isInPeriod =
    date >= period.startDate &&
    date <= period.endDate &&
    minutes >= toMinutes(period.startTime) &&
    minutes < toMinutes(period.endTime) + period.unitMinutes;
  if (!isInPeriod) warnings.push(INTERVIEW_WARNING.outOfPeriod);

  if (sameTimeCount > 1) warnings.push(INTERVIEW_WARNING.duplicated(sameTimeCount));
  return warnings;
};

// 'YYYY-MM-DD' 문자열끼리 비교한다
export const isWithinMonths = (date: string, baseDate: string, months: number) => {
  const [year, month, day] = baseDate.split('-').map(Number);
  const limit = new Date(Date.UTC(year, month - 1 + months, day)).toISOString().slice(0, 10);
  return date <= limit;
};
