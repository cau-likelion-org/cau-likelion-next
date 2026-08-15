import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Tab from '@common/tab/Tab';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { getTracks } from 'src/apis/track';
import { getCurriculums } from 'src/apis/curriculum';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

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

  const [activeTrackKey, setActiveTrackKey] = useState('');

  const activeTrack = tracks?.find((track) => String(track.id) === activeTrackKey) ?? tracks?.[0];

  const weeks = (curriculums ?? [])
    .filter((curriculum) => curriculum.trackId === activeTrack?.id)
    .map((curriculum) => ({
      key: String(curriculum.id),
      badge: curriculum.week,
      title: curriculum.title,
      content: curriculum.description,
    }));

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
              items={(tracks ?? []).map((track) => ({ key: String(track.id), label: track.koName }))}
              activeKey={String(activeTrack.id)}
              onChange={setActiveTrackKey}
              size="large"
              horizontalPadding
            />
            <Content>
              <CurriculumInfoCard track={activeTrack} />
              <WeekAccordion key={activeTrack.id} weeks={weeks} />
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
    /* 세로로 쌓일 때는 카드가 콘텐츠 폭으로 줄지 않고 전체 폭을 쓰도록 */
    align-items: stretch;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
