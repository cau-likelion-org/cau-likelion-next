import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';

import Tab from '@common/tab/Tab';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { getTracks } from 'src/apis/track';
import { getCurriculums } from 'src/apis/curriculum';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import type { CurriculumTrack } from './data';
import CurriculumInfoCard from './component/CurriculumInfoCard';
import WeekAccordion from './component/WeekAccordion';

const CurriculumSection = () => {
  const {
    data: tracks,
    isLoading: isTracksLoading,
    isError: isTracksError,
  } = useQuery({ queryKey: ['tracks'], queryFn: getTracks });
  const {
    data: curriculums,
    isLoading: isCurriculumsLoading,
    isError: isCurriculumsError,
  } = useQuery({ queryKey: ['curriculums'], queryFn: getCurriculums });

  const isLoading = isTracksLoading || isCurriculumsLoading;
  const isError = isTracksError || isCurriculumsError;

  const curriculumTracks: CurriculumTrack[] = useMemo(
    () =>
      (tracks ?? []).map((track) => ({
        key: String(track.id),
        label: track.koName,
        title: track.koName,
        subtitle: track.enName,
        items: track.introduction.split('\n').filter((line) => line.trim() !== ''),
        chips: track.techStack,
        weeks: (curriculums ?? [])
          .filter((curriculum) => curriculum.trackKoName === track.koName)
          .map((curriculum) => ({
            key: String(curriculum.id),
            badge: curriculum.week,
            title: curriculum.title,
            content: curriculum.description,
          })),
      })),
    [tracks, curriculums],
  );

  const [selectedTrackKey, setSelectedTrackKey] = useState('');
  const activeTrack = curriculumTracks.find((track) => track.key === selectedTrackKey) ?? curriculumTracks[0];
  const tabItems = curriculumTracks.map((track) => ({ key: track.key, label: track.label }));

  return (
    <Wrapper>
      <SectionTitle>14기 커리큘럼</SectionTitle>
      {isLoading ? (
        <LoadingWrapper>
          <LinearLoading />
        </LoadingWrapper>
      ) : isError ? (
        <EmptyState variant="error" />
      ) : (
        activeTrack && (
          <>
            <Tab
              items={tabItems}
              activeKey={activeTrack.key}
              onChange={setSelectedTrackKey}
              size="large"
              horizontalPadding
            />
            <Content>
              <CurriculumInfoCard track={activeTrack} />
              <WeekAccordion key={activeTrack.key} weeks={activeTrack.weeks} />
            </Content>
          </>
        )
      )}
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

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
