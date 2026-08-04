import styled from 'styled-components';
import ContentBadge from '@common/badge/ContentBadge';
import Thumbnail from '@common/thumbnail/Thumbnail';
import { BackgroundWhite, Fill, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface BlogCardProps {
  title: string;
  description: string;
  badges: string[];
  date: string;
  url: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
}

const BlogCard = ({ title, description, badges, date, url, thumbnailUrl, thumbnailAlt }: BlogCardProps) => (
  <Wrapper href={url} target="_blank" rel="noopener noreferrer">
    <Container>
      <TextGroup>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextGroup>
      <BottomRow>
        <BadgeRow>
          {badges.map((badge) => (
            <ContentBadge key={badge} text={badge} color="accent" size="medium" />
          ))}
        </BadgeRow>
        <Date>{date}</Date>
      </BottomRow>
    </Container>
    <ThumbnailSlot>
      {thumbnailUrl ? (
        <Thumbnail src={thumbnailUrl} alt={thumbnailAlt ?? title} ratio={1} radius border />
      ) : (
        <ThumbnailPlaceholder />
      )}
    </ThumbnailSlot>
  </Wrapper>
);

export default BlogCard;

const Wrapper = styled.a`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: ${BackgroundWhite.secondary};
  cursor: pointer;
  text-align: left;
  text-decoration: none;
`;

const Container = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  align-self: stretch;
  padding: 0 6px;
`;

const TextGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
`;

const Title = styled.p`
  ${typographyCss(Typography.title2.bold)}
  color: ${Label.normal};
  width: 100%;
  margin: 0;
`;

const Description = styled.p`
  ${typographyCss(Typography.heading2.medium)}
  color: ${Label.normal};
  width: 100%;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

const BottomRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Date = styled.p`
  ${typographyCss(Typography.body1Reading.regular)}
  color: ${Label.alternative};
  margin: 0;
`;

const ThumbnailSlot = styled.div`
  flex-shrink: 0;
  width: 213px;
  height: 213px;
`;

const ThumbnailPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 1px solid ${Line.subtle};
  background-color: ${Fill.subtle};
`;
