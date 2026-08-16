import Link from 'next/link';
import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import LogoTrophy from 'src/assets/svg/logo/logo-trophy.svg';
import { ProjectCategory } from 'src/apis/project';
import { Black, Fill, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { MOBILE } from '@home/common/responsive';

export const PROJECT_CATEGORY_LABEL: Record<ProjectCategory, string> = {
  IDEATHON: '아이디어톤',
  HACKATHON: '해커톤',
  CHUNGKATHON: '중커톤',
  ETC: '기타',
};

export interface IProject {
  title: string;
  generationNumber: number;
  category: ProjectCategory;
  banner: string;
}

const ProjectCard = ({ title, generationNumber, category, banner, href }: IProject & { href: string }) => {
  return (
    <Link href={href}>
      <Wrapper>
        <ThumbnailArea>
          {banner && (
            <AwardBanner>
              <LogoTrophy width={24} height={24} />
              <AwardText>{banner}</AwardText>
            </AwardBanner>
          )}
        </ThumbnailArea>
        <Container>
          <Name>{title}</Name>
          <BadgeRow>
            <ContentBadge text={`${generationNumber}기`} color="accent" size="medium" />
            <ContentBadge text={PROJECT_CATEGORY_LABEL[category]} color="accent" size="medium" />
          </BadgeRow>
        </Container>
      </Wrapper>
    </Link>
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

  @media (max-width: ${MOBILE}px) {
    width: 335px;
  }
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

const Name = styled.p`
  ${typographyCss(Typography.title3.bold)}
  color: ${Label.normal};
  width: 100%;
  margin: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 6px;
`;
