import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import LogoTrophy from 'src/assets/svg/logo/logo-trophy.svg';
import { Black, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface IProject {
  name: string;
  generation: string;
  category: string;
  award?: string;
}

const ProjectCard = ({ name, generation, category, award, onClick }: IProject & { onClick?: () => void }) => {
  return (
    <Wrapper onClick={onClick}>
      <ThumbnailArea>
        {award && (
          <AwardBanner>
            <LogoTrophy width={24} height={24} />
            <AwardText>{award}</AwardText>
          </AwardBanner>
        )}
      </ThumbnailArea>
      <Container>
        <Name>{name}</Name>
        <BadgeRow>
          <ContentBadge text={generation} color="accent" size="medium" />
          <ContentBadge text={category} color="accent" size="medium" />
        </BadgeRow>
      </Container>
    </Wrapper>
  );
};

export default ProjectCard;

const Wrapper = styled.div`
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
`;

const ThumbnailArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 340 / 191.25;
  border-radius: 12px;
  background-color: ${Fill.normal};
  box-shadow: inset 0 0 0 1px ${Line.subtle};
  overflow: hidden;
`;

const AwardBanner = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: ${Black.b900};
`;

const AwardText = styled.p`
  ${typographyCss(Typography.heading1.bold)}
  flex: 1 0 0;
  min-width: 0;
  color: ${Orange.o500};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

const Container = styled.div`
  width: 100%;
  padding: 0 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Name = styled.p`
  ${typographyCss(Typography.title3.bold)}
  color: ${Label.normal};
  width: 100%;
  margin: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
