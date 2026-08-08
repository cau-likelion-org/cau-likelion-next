import { useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import Tab from '@common/tab/Tab';
import Textarea from '@common/textarea/Textarea';
import TextField from '@common/textField/TextField';
import CharCount from '@common/charCount/CharCount';
import AddCardButton from '@mypage/admin/component/AddCardButton';
import RemoveCardButton from '@mypage/admin/component/RemoveCardButton';
import { BackgroundWhite, Label, Line } from '@utils/constant/color';
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

const createEmptyWeek = (): CurriculumWeekItem => ({ id: createId(), week: '', title: '', description: '' });

const CurriculumSection = ({
  tracks,
  onChange,
  onSave,
}: {
  tracks: CurriculumTrackItems[];
  onChange: (tracks: CurriculumTrackItems[]) => void;
  onSave: () => void;
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
                onChange={(event) => updateWeek(week.id, { week: event.target.value })}
              />
            </WeekFieldWrapper>
            <TitleFieldWrapper>
              <TextField
                heading="커리큘럼 제목"
                value={week.title}
                placeholder="텍스트 입력"
                onChange={(event) => updateWeek(week.id, { title: event.target.value })}
              />
            </TitleFieldWrapper>
          </Row>
          <Textarea
            heading="설명"
            value={week.description}
            placeholder="텍스트 입력"
            maxLength={1000}
            bottomTrailingContent={<CharCount>{week.description.length}/1000</CharCount>}
            onChange={(event) => updateWeek(week.id, { description: event.target.value })}
          />
          <ButtonRow>
            <RemoveCardButton onClick={() => removeWeek(week.id)} />
          </ButtonRow>
        </Card>
      ))}
      <AddCardButton onClick={addWeek} ariaLabel="커리큘럼 주차 추가" />
      <Button size="large" onClick={onSave}>
        저장
      </Button>
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
