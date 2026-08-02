import { IProjectData } from '@@types/request';
import { AccentTint, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { track, getDeviceType, getPageEntryTime } from 'src/lib/amplitude';

interface ProjectCardProps extends IProjectData {
  generation: string;
  cardPosition: number;
  totalImageCount: number;
}

const ProjectCard = ({
  id,
  thumbnail,
  title,
  category,
  subtitle,
  description,
  generation,
  cardPosition,
  totalImageCount,
}: ProjectCardProps) => {
  const router = useRouter();
  const introText = subtitle || description;

  const handleClick = () => {
    track('Archiving Card Clicked', {
      archiving_type: 'project',
      item_id: id,
      item_title: title,
      card_position: cardPosition,
      referrer_path: router.asPath,
    });
  };

  const handleImageLoad = () => {
    track('Image Load Completed', {
      page_path: router.asPath,
      load_duration_ms: Date.now() - getPageEntryTime(),
      image_count: totalImageCount,
      device_type: getDeviceType(),
    });
  };

  return (
    <Link href={`/project/${id}`} prefetch={false} shallow>
      <Wrapper onClick={handleClick}>
        <Thumbnail>
          <img
            key={thumbnail}
            src={thumbnail || '/image/likelion_thumbnail.png'}
            alt={title}
            onLoad={handleImageLoad}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/image/likelion_thumbnail.png';
            }}
          />
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
  ${typographyCss(Typography.heading1.bold)}
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

  &:hover ${HoverOverlay} {
    opacity: 1;
  }
`;
