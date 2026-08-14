import { useState } from 'react';
import styled from 'styled-components';

import Tab from '@common/tab/Tab';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import CharCount from '@common/charCount/CharCount';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import { isUnfilled } from '@utils/index';
import { BackgroundWhite, Label, Line, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { createId } from './utils';

export interface CurriculumWeekItem {
  id: string;
  week: string;
  title: string;
  description: string;
}

export interface CurriculumTrackItems {
  key: string;
  label: string;
  weeks: CurriculumWeekItem[];
}

// 설명은 실제 소개 페이지 데이터(CurriculumWeek.content)에서도 선택 항목이라 필수에서 제외
const isCurriculumWeekInvalid = (week: CurriculumWeekItem) => isUnfilled(week.week) || isUnfilled(week.title);

export const isCurriculumTracksInvalid = (tracks: CurriculumTrackItems[]) =>
  tracks.some((track) => track.weeks.length === 0 || track.weeks.some(isCurriculumWeekInvalid));

const createEmptyWeek = (): CurriculumWeekItem => ({ id: createId(), week: '', title: '', description: '' });

const CurriculumSection = ({
  tracks,
  onChange,
  showErrors,
  disabled = false,
}: {
  tracks: CurriculumTrackItems[];
  onChange: (tracks: CurriculumTrackItems[]) => void;
  showErrors: boolean;
  disabled?: boolean;
}) => {
  const [activeKey, setActiveKey] = useState(tracks[0].key);
  const activeTrack = tracks.find((track) => track.key === activeKey) ?? tracks[0];

  const updateWeeks = (updater: (weeks: CurriculumWeekItem[]) => CurriculumWeekItem[]) => {
    onChange(tracks.map((track) => (track.key === activeKey ? { ...track, weeks: updater(track.weeks) } : track)));
  };

  const updateWeek = (id: string, patch: Partial<CurriculumWeekItem>) => {
    updateWeeks((weeks) => weeks.map((week) => (week.id === id ? { ...week, ...patch } : week)));
  };

  const removeWeek = (id: string) => updateWeeks((weeks) => weeks.filter((week) => week.id !== id));

  const addWeek = () => updateWeeks((weeks) => [...weeks, createEmptyWeek()]);

  return (
    <Section>
      <Title>커리큘럼 관리</Title>
      <Tab
        items={tracks.map((track) => ({ key: track.key, label: track.label }))}
        activeKey={activeKey}
        onChange={setActiveKey}
        size="large"
      />
      {activeTrack.weeks.map((week) => (
        <Card key={week.id}>
          <Row>
            <WeekFieldWrapper>
              <TextField
                heading="주차"
                value={week.week}
                placeholder="텍스트 입력"
                readOnly={disabled}
                onChange={(event) => updateWeek(week.id, { week: event.target.value })}
                status={showErrors && isUnfilled(week.week) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(week.week) ? '주차를 입력해 주세요.' : undefined}
              />
            </WeekFieldWrapper>
            <TitleFieldWrapper>
              <TextField
                heading="커리큘럼 제목"
                value={week.title}
                placeholder="텍스트 입력"
                readOnly={disabled}
                onChange={(event) => updateWeek(week.id, { title: event.target.value })}
                status={showErrors && isUnfilled(week.title) ? 'negative' : 'normal'}
                description={showErrors && isUnfilled(week.title) ? '커리큘럼 제목을 입력해 주세요.' : undefined}
              />
            </TitleFieldWrapper>
          </Row>
          <Textarea
            heading="설명"
            value={week.description}
            placeholder="텍스트 입력"
            maxLength={1000}
            readOnly={disabled}
            bottomTrailingContent={<CharCount>{week.description.length}/1000</CharCount>}
            onChange={(event) => updateWeek(week.id, { description: event.target.value })}
          />
          {!disabled && (
            <ButtonRow>
              <RemoveCardButton onClick={() => removeWeek(week.id)} />
            </ButtonRow>
          )}
        </Card>
      ))}
      {showErrors && activeTrack.weeks.length === 0 && <ErrorText>이 트랙에 주차를 하나 이상 추가해 주세요.</ErrorText>}
      {!disabled && <AddCardButton onClick={addWeek} ariaLabel="커리큘럼 주차 추가" />}
    </Section>
  );
};

export default CurriculumSection;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const WeekFieldWrapper = styled.div`
  flex: 0 0 160px;
`;

const TitleFieldWrapper = styled.div`
  flex: 1 0 0;
  min-width: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${State.error};
  ${typographyCss(Typography.caption1.regular)}
`;
