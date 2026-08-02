import { useState } from 'react';
import styled from 'styled-components';

import Tab from '@common/tab/Tab';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import { CURRICULUM_TRACKS } from './data';
import CurriculumInfoCard from './component/CurriculumInfoCard';
import WeekAccordion from './component/WeekAccordion';

const TAB_ITEMS = CURRICULUM_TRACKS.map((track) => ({ key: track.key, label: track.label }));

const CurriculumSection = () => {
  const [activeTrackKey, setActiveTrackKey] = useState(CURRICULUM_TRACKS[0].key);
  const activeTrack = CURRICULUM_TRACKS.find((track) => track.key === activeTrackKey) ?? CURRICULUM_TRACKS[0];

  return (
    <Wrapper>
      <SectionTitle>14기 커리큘럼</SectionTitle>
      <Tab items={TAB_ITEMS} activeKey={activeTrackKey} onChange={setActiveTrackKey} size="large" horizontalPadding />
      <Content>
        <CurriculumInfoCard track={activeTrack} />
        <WeekAccordion key={activeTrack.key} weeks={activeTrack.weeks} />
      </Content>
    </Wrapper>
  );
};

export default CurriculumSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  width: 100%;
  max-width: 1060px;
  margin: 0 auto;
  padding: 80px 20px;
`;

const SectionTitle = styled.p`
  margin: 0;
  width: 100%;
  text-align: center;
  color: ${Label.normal};
  ${typographyCss(Typography.display2.bold)}
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
