import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import Chip from '@common/chip/Chip';
import { getTracks } from 'src/apis/track';
import LinearLoading from '@common/loading/LinearLoading';
import EmptyState from '@common/emptyState/EmptyState';
import { Black, BackgroundWhite, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const TrackSection = () => {
  const { data: tracks, isLoading, isError } = useQuery({ queryKey: ['tracks'], queryFn: getTracks });

  return (
    <Wrapper>
      <Title>14기 트랙 소개</Title>
      {isLoading ? (
        <LoadingWrapper>
          <LinearLoading />
        </LoadingWrapper>
      ) : isError ? (
        <EmptyState variant="error" />
      ) : (
        <TrackListGroup>
          <TrackList>
            {tracks?.map(({ id, koName, enName, introduction, techStack }) => (
              <TrackCard key={id}>
                <TrackHeader>
                  <TrackName>{koName}</TrackName>
                  <TrackEnglishName>{enName}</TrackEnglishName>
                </TrackHeader>
                <TrackBody>
                  <BulletBox>
                    {introduction
                      .split('\n')
                      .filter((line) => line.trim() !== '')
                      .map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                  </BulletBox>
                  <ChipWrap>
                    {techStack.map((chip) => (
                      <Chip key={chip} variant="outlined" size="medium">
                        {chip}
                      </Chip>
                    ))}
                  </ChipWrap>
                </TrackBody>
              </TrackCard>
            ))}
          </TrackList>
          <Footnote>*출처정보 (2026년 02월 기준)</Footnote>
        </TrackListGroup>
      )}
    </Wrapper>
  );
};

export default TrackSection;

const Wrapper = styled.div`
  width: 1060px;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
  scroll-snap-align: start;
`;

const Title = styled.p`
  ${typographyCss(Typography.display2.bold)}
  color: ${Black.b900};
  margin: 0;
`;

const TrackListGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 28px;
`;

const TrackList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const TrackCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 32px;
  border-radius: 22px;
  background-color: ${BackgroundWhite.secondary};
  box-shadow: inset 0 0 0 1px ${Line.subtle};
`;

const TrackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TrackName = styled.p`
  ${typographyCss(Typography.title2.bold)}
  color: ${Black.b900};
  margin: 0;
`;

const TrackEnglishName = styled.p`
  ${typographyCss(Typography.headline1.regular)}
  color: ${Black.b80};
  margin: 0;
`;

const TrackBody = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;

const BulletBox = styled.ul`
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  padding: 22px;
  border-radius: 8px;
  background-color: ${BackgroundWhite.tertiary};
  ${typographyCss(Typography.body1Normal.medium)}
  color: ${Black.b900};

  li {
    margin-left: 24px;
    margin-bottom: 8px;
  }
  li:last-child {
    margin-bottom: 0;
  }
`;

const ChipWrap = styled.div`
  width: 280px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 14px;
`;

const Footnote = styled.p`
  ${typographyCss(Typography.caption1.regular)}
  color: ${Black.b50};
  align-self: flex-start;
  margin: 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
`;
