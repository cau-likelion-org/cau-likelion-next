import styled from 'styled-components';

import { Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

import type { TrackResponse } from 'src/apis/track';

export interface CurriculumInfoCardProps {
  track: TrackResponse;
}

const CurriculumInfoCard = ({ track }: CurriculumInfoCardProps) => {
  const introductions = track.introduction
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  return (
    <Wrapper>
      <Heading>
        <Title>{track.koName}</Title>
        <Subtitle>{track.enName}</Subtitle>
      </Heading>
      <List>
        {introductions.map((item, index) => (
          <ListItem key={index}>{item}</ListItem>
        ))}
      </List>
      <ChipRow>
        {track.techStack.map((chip) => (
          <Chip key={chip}>{chip}</Chip>
        ))}
      </ChipRow>
    </Wrapper>
  );
};

export default CurriculumInfoCard;

const Wrapper = styled.div`
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 38px;
  padding: 32px;
  border: 1px solid ${Orange.o75};
  border-radius: 22px;
  background-color: ${Orange.o50};
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.title2.bold)}
`;

const Subtitle = styled.p`
  margin: 0;
  color: #9b9b9b;
  ${typographyCss(Typography.headline1.regular)}
`;

const List = styled.ul`
  margin: 0;
  padding-left: 27px;
  width: 100%;
  color: ${Label.normal};
  list-style: disc;
  ${typographyCss(Typography.headline1.medium)}
`;

const ListItem = styled.li`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  width: 100%;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 7px 11px;
  border: 1px solid ${Line.normal};
  border-radius: 10px;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.medium)}
`;
