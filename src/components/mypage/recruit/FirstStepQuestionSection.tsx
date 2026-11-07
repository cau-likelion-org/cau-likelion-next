import { useState } from 'react';
import styled, { css } from 'styled-components';

import Button from '@common/button/Button';
import DateTimeInput from '@common/dateTimeInput/DateTimeInput';
import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import { IcLineHorizontal } from '@assets/svg';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { BackgroundWhite, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { RecruitInterviewSetting } from './mock';
import RecruitInfoBox, { InfoText } from './RecruitInfoBox';

const FIXED_QUESTIONS = [
  { label: '이름', inputType: '0단계 입력 (수정불가)' },
  { label: '전화번호', inputType: '0단계 입력 (수정불가)' },
  { label: '이메일', inputType: '0단계 입력 (수정불가)' },
  { label: '학번', inputType: '텍스트 (숫자 8자리)' },
  { label: '학과', inputType: '텍스트' },
  { label: '학년', inputType: '드롭다운 (1학년 / 2학년 / 3학년 / 4학년 / 5학년 이상)(3월 기준)' },
  { label: '이수 학기', inputType: '숫자' },
  { label: '학적', inputType: '드롭다운 (재학 / 휴학 / 졸업 유예)(3월 기준)' },
  { label: '포탈 내정보수정 캡쳐', inputType: '이미지 (JPG·JPEG·PNG)(5MB 이하)' },
  { label: '지원 경로', inputType: '드롭다운  (멋사 중앙대 홈페이지 / 인스타그램 / 에브리타임 / 지인 추천 / 기타)' },
  { label: '지원 파트', inputType: '드롭다운 (모집 기수에 연결된 파트)' },
];

const UNIT_OPTIONS = [
  { label: '1시간', minutes: 60 },
  { label: '2시간', minutes: 120 },
];

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const toDateLabel = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}(${DAY_LABELS[date.getDay()]})`;

const getDateLabels = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) return [];
  const labels: string[] = [];
  const end = new Date(`${endDate}T00:00`);
  for (let date = new Date(`${startDate}T00:00`); date <= end; date.setDate(date.getDate() + 1)) {
    labels.push(toDateLabel(date));
  }
  return labels;
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTimeLabel = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const getTimeLabels = (startTime: string, endTime: string, unitMinutes: number) => {
  if (!startTime || !endTime) return [];
  const labels: string[] = [];
  for (let minutes = toMinutes(startTime); minutes <= toMinutes(endTime); minutes += unitMinutes) {
    labels.push(toTimeLabel(minutes));
  }
  return labels;
};

export interface FirstStepQuestionSectionProps {
  initialValues: RecruitInterviewSetting;
  onSave: (values: RecruitInterviewSetting) => void;
}

const FirstStepQuestionSection = ({ initialValues, onSave }: FirstStepQuestionSectionProps) => {
  const [values, setValues] = useState(initialValues);
  const [savedValues, setSavedValues] = useState(initialValues);
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  const update = (patch: Partial<RecruitInterviewSetting>) => setValues((prev) => ({ ...prev, ...patch }));

  const unitLabel = UNIT_OPTIONS.find((option) => option.minutes === values.unitMinutes)?.label ?? '';
  const unitLabels = UNIT_OPTIONS.map((option) => option.label);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen: isUnitOpen,
    options: unitLabels,
    value: unitLabel,
    onOpen: () => setIsUnitOpen(true),
    onClose: () => setIsUnitOpen(false),
    onSelect: (label) => update({ unitMinutes: UNIT_OPTIONS.find((option) => option.label === label)!.minutes }),
  });

  const dateLabels = getDateLabels(values.startDate, values.endDate);
  const timeLabels = getTimeLabels(values.startTime, values.endTime, values.unitMinutes);

  const isFilled = !!values.startDate && !!values.endDate && !!values.startTime && !!values.endTime;
  const isChanged = JSON.stringify(values) !== JSON.stringify(savedValues);

  const handleSave = () => {
    onSave(values);
    setSavedValues(values);
  };

  return (
    <Wrapper>
      <RecruitInfoBox title="1단계 문항은 고정 문항입니다">
        <InfoText>
          면접 가능 시간 설정만 변경할 수 있습니다. <Emphasis>접수 시작 일시부터는 수정할 수 없습니다.</Emphasis>
        </InfoText>
      </RecruitInfoBox>
      <Group>
        <SectionTitle>고정 문항</SectionTitle>
        <QuestionTable>
          <QuestionHeader>
            <HeaderCell>문항</HeaderCell>
            <HeaderCell>입력 방식</HeaderCell>
          </QuestionHeader>
          {FIXED_QUESTIONS.map((question, index) => (
            <QuestionRow key={question.label} $divider={index !== 0}>
              <QuestionLabel>{question.label}</QuestionLabel>
              <QuestionInputType>{question.inputType}</QuestionInputType>
            </QuestionRow>
          ))}
        </QuestionTable>
      </Group>
      <Group>
        <SectionTitle>면접 시간 설정</SectionTitle>
        <Card>
          <FieldGroup>
            <Field>
              <FieldLabel>면접 기간</FieldLabel>
              <RangeRow>
                <DateTimeInput
                  aria-label="면접 시작일"
                  value={values.startDate}
                  onChange={(startDate) => update({ startDate })}
                />
                <RangeIcon />
                <DateTimeInput
                  aria-label="면접 종료일"
                  value={values.endDate}
                  min={values.startDate}
                  onChange={(endDate) => update({ endDate })}
                />
              </RangeRow>
            </Field>
            <Field>
              <FieldLabel>면접 시각</FieldLabel>
              <RangeRow>
                <DateTimeInput
                  type="time"
                  aria-label="면접 시작 시각"
                  value={values.startTime}
                  onChange={(startTime) => update({ startTime })}
                />
                <RangeIcon />
                <DateTimeInput
                  type="time"
                  aria-label="면접 종료 시각"
                  value={values.endTime}
                  onChange={(endTime) => update({ endTime })}
                />
              </RangeRow>
            </Field>
          </FieldGroup>
          <UnitField ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
            <Select
              ref={triggerRef}
              heading="선택 단위"
              aria-label="선택 단위"
              aria-expanded={isUnitOpen}
              aria-controls={listId}
              aria-activedescendant={isUnitOpen ? `${listId}-${activeIndex}` : undefined}
              value={unitLabel}
              onClick={() => setIsUnitOpen((prev) => !prev)}
            >
              {isUnitOpen && (
                <ListboxOptions
                  listId={listId}
                  options={unitLabels}
                  value={unitLabel}
                  activeIndex={activeIndex}
                  onSelect={selectOption}
                />
              )}
            </Select>
          </UnitField>
        </Card>
        <Preview>
          <PreviewTitle>지원자 화면 미리보기</PreviewTitle>
          {dateLabels.length > 0 && timeLabels.length > 0 && (
            <GridScroll>
              <Grid $columns={dateLabels.length}>
                <HeaderCellBox />
                {dateLabels.map((label) => (
                  <HeaderCellBox key={label}>{label}</HeaderCellBox>
                ))}
                {timeLabels.map((time) => (
                  <GridRow key={time}>
                    <TimeCellBox>{time}</TimeCellBox>
                    {dateLabels.map((label) => (
                      <SlotCellBox key={label} />
                    ))}
                  </GridRow>
                ))}
              </Grid>
            </GridScroll>
          )}
        </Preview>
      </Group>
      <Actions>
        <Button disabled={!isFilled || !isChanged} onClick={handleSave}>
          저장
        </Button>
      </Actions>
    </Wrapper>
  );
};

export default FirstStepQuestionSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  width: 100%;
  padding: 38px 14px;
`;

const Emphasis = styled.span`
  color: ${Orange.o500};
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

const QuestionTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  height: 26px;
`;

const HeaderCell = styled.p`
  margin: 0;
  color: ${Label.assistive};
  ${typographyCss(Typography.headline1.medium)}

  &:first-child {
    flex-shrink: 0;
    width: 160px;
  }
`;

const QuestionRow = styled.div<{ $divider: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 4px 0;

  ${(props) =>
    props.$divider &&
    `
    margin-top: 12px;

    &::before {
      content: '';
      position: absolute;
      top: -12.5px;
      left: 0;
      right: 0;
      height: 1px;
      background-color: ${Line.normal};
    }
  `}
`;

const QuestionLabel = styled.p`
  flex-shrink: 0;
  width: 160px;
  margin: 0;
  color: ${Label.strong};
  white-space: nowrap;
  ${typographyCss(Typography.headline1.bold)}
`;

const QuestionInputType = styled.p`
  margin: 0;
  color: ${Label.alternative};
  white-space: pre-wrap;
  ${typographyCss(Typography.headline2.medium)}
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

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const RangeIcon = styled(IcLineHorizontal)`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${Label.assistive};
`;

const UnitField = styled.div`
  width: 160px;
`;

const Preview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const PreviewTitle = styled.h3`
  margin: 0;
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.bold)}
`;

const GridScroll = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: 100px repeat(${(props) => props.$columns}, 140px);
  width: max-content;
  border-radius: 18px;
  overflow: hidden;
`;

const GridRow = styled.div`
  display: contents;
`;

const cellCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  box-shadow: inset 0 0 0 1px ${Black.b30};
  color: ${Label.normal};
  ${typographyCss(Typography.label1Normal.bold)}
`;

const HeaderCellBox = styled.div`
  ${cellCss}
  background-color: ${Orange.o100};
`;

const TimeCellBox = styled.div`
  ${cellCss}
  background-color: ${Orange.o50};
`;

const SlotCellBox = styled.div`
  ${cellCss}
  background-color: ${Black.b10};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
