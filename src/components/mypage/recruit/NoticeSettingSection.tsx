import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import Switch from '@common/switch/Switch';
import FaqCardList, { isFaqItemInvalid } from '@mypage/component/FaqCardList';
import { REQUIRED_FIELD_MESSAGE } from '@utils/constant';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitNoticeSetting, RecruitScheduleField, RecruitScheduleItem } from './mock';
import RecruitInfoBox, { InfoText } from './RecruitInfoBox';
import useRequiredSave from './useRequiredSave';

export interface NoticeSettingSectionProps {
  initialValues: RecruitNoticeSetting;
  onSave: (values: RecruitNoticeSetting, isUpdate: boolean) => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

const isPastField = (field: RecruitScheduleField) =>
  !!field.disallowPast && !!field.date && !!field.time && new Date(`${field.date}T${field.time}`) < new Date();

const toDateTime = (field?: RecruitScheduleField) =>
  field?.date && field.time ? new Date(`${field.date}T${field.time}`) : null;

// 시작/마감이 짝으로 있는 일정은 마감 일시가 시작 일시보다 뒤여야 한다
const isEndBeforeStart = (schedule: RecruitScheduleItem, field: RecruitScheduleField) => {
  if (field.key !== 'end') return false;
  const start = toDateTime(schedule.fields.find((item) => item.key === 'start'));
  const end = toDateTime(field);
  return !!start && !!end && end <= start;
};

const isScheduleFilled = (schedule: RecruitScheduleItem) =>
  !schedule.isVisible ||
  schedule.fields.every(
    (field) => field.date !== '' && field.time !== '' && !isPastField(field) && !isEndBeforeStart(schedule, field),
  );

const isNoticeFilled = (notice: RecruitNoticeSetting) =>
  notice.schedules.every(isScheduleFilled) && notice.faqs.length > 0 && !notice.faqs.some(isFaqItemInvalid);

const toDateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const NoticeSettingSection = ({ initialValues, onSave, onDirtyChange }: NoticeSettingSectionProps) => {
  const [values, setValues] = useState(initialValues);
  const [savedValues, setSavedValues] = useState(initialValues);
  // 저장된 공고가 있으면 읽기 전용으로 시작하고, [수정]을 눌러야 편집할 수 있다
  const [hasSaved, setHasSaved] = useState(() => isNoticeFilled(initialValues));
  const [isEditing, setIsEditing] = useState(!hasSaved);
  const isDirty = JSON.stringify(values) !== JSON.stringify(savedValues);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // 탭 전환 등으로 화면이 사라지면 저장하지 않은 변경사항도 함께 사라진다
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  const today = toDateValue(new Date());

  const isFilled = isNoticeFilled(values);

  const { wrapperRef, showErrors, requestSave, hideErrors } = useRequiredSave(isFilled, () => {
    onSave(values, hasSaved);
    setSavedValues(values);
    setHasSaved(true);
    setIsEditing(false);
  });

  const handleCancel = () => {
    hideErrors();
    setValues(savedValues);
    setIsEditing(false);
  };

  const updateSchedule = (key: string, patch: Partial<RecruitScheduleItem>) => {
    setValues((prev) => ({
      ...prev,
      schedules: prev.schedules.map((schedule) => (schedule.key === key ? { ...schedule, ...patch } : schedule)),
    }));
  };

  const updateField = (schedule: RecruitScheduleItem, fieldKey: string, patch: Partial<RecruitScheduleField>) => {
    updateSchedule(schedule.key, {
      fields: schedule.fields.map((field) => (field.key === fieldKey ? { ...field, ...patch } : field)),
    });
  };

  return (
    <Wrapper ref={wrapperRef}>
      <RecruitInfoBox title="인재상, 커리큘럼, 연간일정 수정">
        <InfoText>인재상, 커리큘럼, 연간일정은</InfoText>
        <InfoBadge text="관리자 →  랜딩, 소개페이지" color="accent" size="medium" />
        <InfoText>에서 수정할 수 있습니다.</InfoText>
      </RecruitInfoBox>
      <Group>
        <SectionTitle>모집 일정</SectionTitle>
        {values.schedules.map((schedule) => (
          <Card key={schedule.key}>
            <CardTitle>{schedule.title}</CardTitle>
            <FieldGroup>
              {schedule.fields.map((field) => {
                const isPast = isPastField(field);
                const isBeforeStart = isEndBeforeStart(schedule, field);
                const isDateMissing = showErrors && schedule.isVisible && field.date === '';
                const isTimeMissing = showErrors && schedule.isVisible && field.time === '';
                const startDate = schedule.fields.find((item) => item.key === 'start')?.date;
                return (
                  <Field key={field.key}>
                    <FieldLabel>{field.label}</FieldLabel>
                    <InputRow>
                      <DateTimeInput
                        aria-label={`${schedule.title} ${field.label} 날짜`}
                        value={field.date}
                        readOnly={!isEditing}
                        min={field.disallowPast ? today : field.key === 'end' ? startDate || undefined : undefined}
                        status={isPast || isBeforeStart || isDateMissing ? 'negative' : 'normal'}
                        description={
                          isPast
                            ? `${field.label}는 현재 이후로 설정해 주세요.`
                            : isBeforeStart
                              ? '마감 일시는 시작 일시 이후로 설정해 주세요.'
                              : isDateMissing || isTimeMissing
                                ? REQUIRED_FIELD_MESSAGE
                                : field.caption
                        }
                        onChange={(date) => updateField(schedule, field.key, { date })}
                      />
                      <DateTimeInput
                        type="time"
                        step={1}
                        aria-label={`${schedule.title} ${field.label} 시간`}
                        placeholder="00:00:00"
                        value={field.time}
                        readOnly={!isEditing}
                        status={isPast || isBeforeStart || isTimeMissing ? 'negative' : 'normal'}
                        onChange={(time) => updateField(schedule, field.key, { time })}
                      />
                    </InputRow>
                  </Field>
                );
              })}
            </FieldGroup>
            <VisibilityRow>
              <FieldLabel>항목 노출 여부</FieldLabel>
              <Switch
                aria-label={`${schedule.title} 항목 노출 여부`}
                checked={schedule.isVisible}
                disabled={!isEditing}
                onChange={(isVisible) => updateSchedule(schedule.key, { isVisible })}
              />
            </VisibilityRow>
          </Card>
        ))}
      </Group>
      <Group>
        <SectionTitle>FAQ</SectionTitle>
        <FaqCardList
          items={values.faqs}
          onChange={(faqs) => setValues((prev) => ({ ...prev, faqs }))}
          showErrors={showErrors}
          disabled={!isEditing}
          minItems={1}
        />
      </Group>
      <Actions>
        {isEditing ? (
          <>
            {hasSaved && (
              <Button color="assistive" onClick={handleCancel}>
                취소
              </Button>
            )}
            <Button disabled={!hasSaved && !isFilled} onClick={requestSave}>
              저장
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={() => setIsEditing(true)}>
            수정
          </Button>
        )}
      </Actions>
    </Wrapper>
  );
};

export default NoticeSettingSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 38px 14px;
`;

const InfoBadge = styled(ContentBadge)`
  span {
    white-space: pre;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px ${Line.subtle};
  background-color: ${BackgroundWhite.secondary};
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.bold)}
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const FieldLabel = styled.p`
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

const VisibilityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  width: 100%;
`;
