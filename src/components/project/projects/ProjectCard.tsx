import { IProjectData } from '@@types/request';
import { AccentTint, Black, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';
import { IcTrophy } from '@assets/svg';
import ThumbnailPlaceholder from '@common/thumbnail/ThumbnailPlaceholder';

interface ProjectCardProps extends IProjectData {
  generation: string;
}

const ProjectCard = ({
  id,
  thumbnail,
  title,
  category,
  subtitle,
  description,
  banner,
  generation,
}: ProjectCardProps) => {
  const introText = subtitle || description;
  // 실패한 src를 기억해두면 thumbnail이 바뀔 때 자동으로 다시 시도하게 된다
  const [failedThumbnail, setFailedThumbnail] = useState<string | null>(null);
  const showThumbnail = !!thumbnail && failedThumbnail !== thumbnail;

  return (
    <Link href={`/project/${id}`} prefetch={false} shallow>
      <Wrapper>
        <Thumbnail>
          {showThumbnail ? (
            <img key={thumbnail} src={thumbnail} alt={title} onError={() => setFailedThumbnail(thumbnail)} />
          ) : (
            <ThumbnailPlaceholder />
          )}
          {banner && (
            <AwardBanner>
              <IcTrophy width={24} height={24} />
              <AwardText>{banner}</AwardText>
            </AwardBanner>
          )}
          {introText && (
            <HoverOverlay>
              <HoverText>{introText.replace(/\\n/g, ' ')}</HoverText>
            </HoverOverlay>
          )}
        </Thumbnail>
        <Content>
          <Title>{title}</Title>
          <BadgeRow>
            <Badge>{generation}기</Badge>
            {category && <Badge>{category}</Badge>}
          </BadgeRow>
        </Content>
      </Wrapper>
    </Link>
  );
};

export default ProjectCard;

const HoverText = styled.p`
  margin: 0;
  color: #fff;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  ${typographyCss(Typography.headline1.bold)}
`;

const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  padding: 12px;
  background-color: ${Orange.o500};
  opacity: 0;
  transition: opacity 0.2s ease;
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
  margin: 0;
  flex: 1 0 0;
  min-width: 0;
  color: ${Orange.o500};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${typographyCss(Typography.headline1.bold)}
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid ${Line.subtle};
  background-color: ${Line.alternative};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.hover} {
    &:hover ${HoverOverlay} {
      opacity: 1;
    }
  }
`;

const Title = styled.p`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  ${typographyCss(Typography.title3.bold)}
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 8px;
  background-color: ${AccentTint.background};
  color: ${Orange.o500};
  white-space: nowrap;
  ${typographyCss(Typography.label2.regular)}
  font-weight: 500;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 6px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  cursor: pointer;
`;
