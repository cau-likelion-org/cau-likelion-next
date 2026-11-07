import { useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import Switch from '@common/switch/Switch';
import FaqCardList, { isFaqItemInvalid } from '@mypage/component/FaqCardList';
import { BackgroundWhite, Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitNoticeSetting, RecruitScheduleField, RecruitScheduleItem } from './mock';

export interface NoticeSettingSectionProps {
  initialValues: RecruitNoticeSetting;
  onSave: (values: RecruitNoticeSetting) => void;
}

const isScheduleFilled = (schedule: RecruitScheduleItem) =>
  !schedule.isVisible || schedule.fields.every((field) => field.date !== '' && field.time !== '');

const NoticeSettingSection = ({ initialValues, onSave }: NoticeSettingSectionProps) => {
  const [values, setValues] = useState(initialValues);

  const isFilled = values.schedules.every(isScheduleFilled) && !values.faqs.some(isFaqItemInvalid);

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
    <Wrapper>
      <InfoBox>
        <InfoTitle>인재상, 커리큘럼, 연간일정 수정</InfoTitle>
        <InfoRow>
          <InfoText>인재상, 커리큘럼, 연간일정은</InfoText>
          <InfoBadge text="관리자 →  랜딩, 소개페이지" color="accent" size="medium" />
          <InfoText>에서 수정할 수 있습니다.</InfoText>
        </InfoRow>
      </InfoBox>
      <Group>
        <SectionTitle>모집 일정</SectionTitle>
        {values.schedules.map((schedule) => (
          <Card key={schedule.key}>
            <CardTitle>{schedule.title}</CardTitle>
            <FieldGroup>
              {schedule.fields.map((field) => (
                <Field key={field.key}>
                  <FieldLabel>{field.label}</FieldLabel>
                  <InputRow>
                    <DateTimeInput
                      aria-label={`${schedule.title} ${field.label} 날짜`}
                      value={field.date}
                      onChange={(date) => updateField(schedule, field.key, { date })}
                    />
                    <DateTimeInput
                      type="time"
                      step={1}
                      aria-label={`${schedule.title} ${field.label} 시간`}
                      placeholder="00:00:00"
                      value={field.time}
                      onChange={(time) => updateField(schedule, field.key, { time })}
                    />
                  </InputRow>
                  {field.caption && <Caption>{field.caption}</Caption>}
                </Field>
              ))}
            </FieldGroup>
            <VisibilityRow>
              <FieldLabel>항목 노출 여부</FieldLabel>
              <Switch
                aria-label={`${schedule.title} 항목 노출 여부`}
                checked={schedule.isVisible}
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
          showErrors={false}
        />
      </Group>
      <Actions>
        <Button disabled={!isFilled} onClick={() => onSave(values)}>
          저장
        </Button>
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

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 18px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
`;

const InfoTitle = styled.p`
  margin: 0;
  color: ${Label.strong};
  ${typographyCss(Typography.headline1.bold)}
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
`;

const InfoText = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Normal.medium)}
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
  gap: 12px;
  width: 100%;
`;

const Caption = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.caption1.regular)}
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
  width: 100%;
`;
