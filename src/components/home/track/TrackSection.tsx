import styled from 'styled-components';

import Chip from '@common/chip/Chip';
import { TRACK, TRACK_NAME } from '@utils/constant';
import { Black, BackgroundWhite, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface ITrack {
  name: string;
  englishName: string;
  bullets: string[];
  chips: string[];
}

const CHIPS = ['Figma', 'UX/UI', 'Prototyping', 'Service design'];
const BULLETS = ['리스트', '리스트', '리스트'];

const TRACKS: ITrack[] = [
  { name: TRACK_NAME[TRACK.PM_DESIGN], englishName: 'Product Manage/Product Design', bullets: BULLETS, chips: CHIPS },
  { name: TRACK_NAME[TRACK.FRONTEND], englishName: 'Frontend Devlopment', bullets: BULLETS, chips: CHIPS },
  { name: TRACK_NAME[TRACK.BACKEND], englishName: 'Backend Devlopment', bullets: BULLETS, chips: CHIPS },
];

const TrackSection = () => {
  return (
    <Wrapper>
      <Title>14기 트랙 소개</Title>
      <TrackListGroup>
        <TrackList>
          {TRACKS.map(({ name, englishName, bullets, chips }) => (
            <TrackCard key={name}>
              <TrackHeader>
                <TrackName>{name}</TrackName>
                <TrackEnglishName>{englishName}</TrackEnglishName>
              </TrackHeader>
              <TrackBody>
                <BulletBox>
                  {bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </BulletBox>
                <ChipWrap>
                  {chips.map((chip) => (
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
