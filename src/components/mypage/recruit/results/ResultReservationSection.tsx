import { forwardRef, useState } from 'react';
import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import { FieldDescription } from '@common/fieldStatus/FieldStatus';
import { toDateTimeLabel } from '@utils/index';
import { isWithinMonths } from '@utils/recruitResult';
import { BackgroundWhite, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import ResultSection from './ResultSection';
import { RECRUIT_END_DATE, StagePublish } from './resultMock';

export interface ReservationCondition {
  label: string;
  done: number;
  total: number;
}

export interface ReservationInput {
  publishAt: string;
  resultEndDate?: string;
}

export interface ResultReservationSectionProps {
  title: string;
  stageLabel: string;
  conditions: ReservationCondition[];
  publish: StagePublish;
  needsResultEndDate: boolean;
  saving: boolean;
  onReserve: (input: ReservationInput) => void;
}

const RESULT_PERIOD_MONTHS = 3;

const ResultReservationSection = forwardRef<HTMLElement, ResultReservationSectionProps>(
  function ResultReservationSection(
    { title, stageLabel, conditions, publish, needsResultEndDate, saving, onReserve },
    ref,
  ) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [resultEndDate, setResultEndDate] = useState('');
    const [errors, setErrors] = useState<{ publishAt?: string; resultEndDate?: string }>({});

    const isConditionMet = conditions.every(({ done, total }) => done >= total);
    const isFilled = !!date && !!time && (!needsResultEndDate || !!resultEndDate);

    const reserve = () => {
      const publishAt = `${date}T${time}`;
      const nextErrors = {
        publishAt:
          new Date(`${publishAt}:00+09:00`).getTime() <= Date.now() ? '현재 이후의 일시를 선택해 주세요.' : undefined,
        resultEndDate:
          needsResultEndDate && !isWithinMonths(resultEndDate, RECRUIT_END_DATE, RESULT_PERIOD_MONTHS)
            ? '결과 확인 종료일은 모집 종료일로부터 3개월을 넘을 수 없습니다.'
            : needsResultEndDate && resultEndDate < date
              ? '결과 확인 종료일은 공개 일시 이후여야 합니다.'
              : undefined,
      };
      setErrors(nextErrors);
      if (nextErrors.publishAt || nextErrors.resultEndDate) return;
      onReserve({ publishAt, resultEndDate: needsResultEndDate ? resultEndDate : undefined });
    };

    if (publish.status === 'PUBLISHED') {
      return (
        <ResultSection ref={ref} title={title}>
          <Card>
            <CardTitle>공개 완료</CardTitle>
            <PublishedText>
              {stageLabel} 결과가 {publish.publishAt ? toDateTimeLabel(new Date(`${publish.publishAt}:00+09:00`)) : ''}
              에 공개되었습니다. 공개 후에는 결과 입력에서 지원자별로 바로 수정할 수 있습니다.
            </PublishedText>
          </Card>
        </ResultSection>
      );
    }

    return (
      <ResultSection
        ref={ref}
        title={title}
        saveLabel="결과 공개 예약"
        saveDisabled={!isConditionMet || !isFilled}
        saving={saving}
        onSave={reserve}
      >
        <Card>
          <CardTitle>공개 조건</CardTitle>
          <Conditions>
            {conditions.map(({ label, done, total }) => {
              const isMet = done >= total;
              return (
                <Condition key={label}>
                  <StatusBadge
                    text={isMet ? '충족' : '미충족'}
                    color={isMet ? 'accent' : 'neutral'}
                    variant="solid"
                    size="xsmall"
                  />
                  <ConditionLabel>{label}</ConditionLabel>
                  <ConditionCount>
                    {done}/{total}
                  </ConditionCount>
                </Condition>
              );
            })}
          </Conditions>
        </Card>
        <Card>
          <Field>
            <CardTitle>공개 일시</CardTitle>
            <DateTimeRow>
              <DateTimeInput
                type="date"
                aria-label="공개 날짜"
                value={date}
                status={errors.publishAt ? 'negative' : 'normal'}
                onChange={setDate}
              />
              <DateTimeInput
                type="time"
                aria-label="공개 시각"
                value={time}
                status={errors.publishAt ? 'negative' : 'normal'}
                onChange={setTime}
              />
            </DateTimeRow>
            {errors.publishAt ? (
              <FieldDescription $status="negative">{errors.publishAt}</FieldDescription>
            ) : (
              <Caption>
                {stageLabel} 결과 보류자에게는 결과가 공개되지 않습니다.{' '}
                <Accent>
                  예약하면 결과·{stageLabel === '서류' ? '면접 정보·' : ''}안내문이 잠기며 공개 전까지 예약을 취소할 수
                  있습니다.
                </Accent>
              </Caption>
            )}
          </Field>
          {needsResultEndDate && (
            <Field>
              <CardTitle>결과 확인 종료일</CardTitle>
              <DateTimeInput
                type="date"
                aria-label="결과 확인 종료일"
                value={resultEndDate}
                status={errors.resultEndDate ? 'negative' : 'normal'}
                description={errors.resultEndDate ?? '결과 확인 종료일은 모집 종료일로부터 3개월을 넘을 수 없습니다.'}
                onChange={setResultEndDate}
              />
            </Field>
          )}
        </Card>
      </ResultSection>
    );
  },
);

export default ResultReservationSection;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const CardTitle = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const Conditions = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: -13px 0 0;
  padding: 0;
  list-style: none;
`;

const Condition = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
`;

// Figma 배지는 글자 폭과 관계없이 같은 너비로 가운데 정렬된다
const StatusBadge = styled(ContentBadge)`
  min-width: 42px;
`;

const ConditionLabel = styled.span`
  flex: 1 0 0;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const ConditionCount = styled.span`
  padding: 0 4px;
  color: ${Label.alternative};
  opacity: 0.74;
  ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DateTimeRow = styled.div`
  display: flex;
  gap: 12px;

  > * {
    flex: 1 0 0;
  }
`;

const Caption = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
`;

const Accent = styled.span`
  color: ${Orange.o500};
`;

const PublishedText = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.medium)}
`;
