import type { ReactNode } from 'react';
import styled from 'styled-components';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';

import { Label, Line } from '@utils/constant/color';
import Thumbnail from '@common/thumbnail/Thumbnail';
import ThumbnailPlaceholder from '@common/thumbnail/ThumbnailPlaceholder';
import SkeletonText from '@common/loading/SkeletonText';
import { skeletonPulse } from '@common/loading/skeletonPulse';

export interface CardProps {
  className?: string;
  platform?: 'desktop' | 'mobile';
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  thumbnailRatio?: number;
  thumbnailOverlay?: boolean;
  overlayCaption?: string;
  saved?: boolean;
  onToggleSave?: () => void;
  title?: string;
  caption?: string;
  subCaption?: string;
  extraCaption?: string;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  skeleton?: boolean;
  onClick?: () => void;
}

const PLATFORM_STYLE = {
  desktop: {
    gap: 10,
    containerGap: 6,
    contentGap: 8,
    containerPaddingX: 6,
    overlayPadding: 14,
    overlayFontSize: 13,
    overlayLineHeight: 1.385,
    overlayLetterSpacing: '0.2522px',
    titleFontSize: 24,
    titleLineHeight: 1.334,
    titleLetterSpacing: '-0.552px',
    titleFontWeight: 700,
    captionFontSize: 16,
    captionLineHeight: 1.625,
    captionLetterSpacing: '0.0912px',
    captionFontWeight: 400,
  },
  mobile: {
    gap: 8,
    containerGap: 6,
    contentGap: 4,
    containerPaddingX: 0,
    overlayPadding: 10,
    overlayFontSize: 12,
    overlayLineHeight: 1.334,
    overlayLetterSpacing: '0.3024px',
    titleFontSize: 15,
    titleLineHeight: 1.467,
    titleLetterSpacing: '0.144px',
    titleFontWeight: 600,
    captionFontSize: 13,
    captionLineHeight: 1.385,
    captionLetterSpacing: '0.2522px',
    captionFontWeight: 500,
  },
} as const;

const Card = ({
  className,
  platform = 'desktop',
  thumbnailSrc,
  thumbnailAlt = '',
  thumbnailRatio = 16 / 9,
  thumbnailOverlay = true,
  overlayCaption,
  saved = false,
  onToggleSave,
  title,
  caption,
  subCaption,
  extraCaption,
  topContent,
  bottomContent,
  skeleton = false,
  onClick,
}: CardProps) => {
  const style = PLATFORM_STYLE[platform];
  const showToggle = !skeleton && !!onToggleSave;
  const showOverlay = !skeleton && thumbnailOverlay && (!!overlayCaption || showToggle);

  return (
    <Wrapper className={className}>
      <CardBody as={onClick ? 'button' : 'div'} type={onClick ? 'button' : undefined} gap={style.gap} onClick={onClick}>
        <ThumbnailArea>
          {skeleton ? (
            <SkeletonThumbnail ratio={thumbnailRatio} />
          ) : thumbnailSrc ? (
            <Thumbnail src={thumbnailSrc} alt={thumbnailAlt} ratio={thumbnailRatio} />
          ) : (
            <ThumbnailPlaceholder ratio={thumbnailRatio} />
          )}
          {showOverlay && (
            <Overlay padding={style.overlayPadding} reserveToggle={showToggle}>
              <Gradient />
              {overlayCaption && (
                <OverlayCaption
                  fontSize={style.overlayFontSize}
                  lineHeight={style.overlayLineHeight}
                  letterSpacing={style.overlayLetterSpacing}
                >
                  {overlayCaption}
                </OverlayCaption>
              )}
            </Overlay>
          )}
        </ThumbnailArea>
        <Container gap={style.containerGap} paddingX={style.containerPaddingX}>
          {topContent && <SlotContent>{topContent}</SlotContent>}
          <Content gap={style.contentGap}>
            {skeleton ? <SkeletonText length="100%" /> : title && <Title $style={style}>{title}</Title>}
            {skeleton
              ? caption !== undefined && <SkeletonText length="75%" />
              : caption && <Caption $style={style}>{caption}</Caption>}
            {skeleton
              ? subCaption !== undefined && <SkeletonText length="50%" />
              : subCaption && <Caption $style={style}>{subCaption}</Caption>}
            {skeleton
              ? extraCaption !== undefined && <SkeletonText length="25%" />
              : extraCaption && <Caption $style={style}>{extraCaption}</Caption>}
          </Content>
          {bottomContent && <SlotContent>{bottomContent}</SlotContent>}
        </Container>
      </CardBody>
      {showToggle && (
        <ToggleButtonSlot offset={style.overlayPadding}>
          <ToggleButton
            type="button"
            aria-label={saved ? '저장 취소' : '저장'}
            aria-pressed={saved}
            onClick={onToggleSave}
          >
            {saved ? <MdBookmark size={20} color="#FFFFFF" /> : <MdBookmarkBorder size={20} color="#FFFFFF" />}
          </ToggleButton>
        </ToggleButtonSlot>
      )}
    </Wrapper>
  );
};

export default Card;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CardBody = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => props.gap}px;
  width: 100%;
  border: none;
  background: none;
  padding: 0;
  text-align: left;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
`;

const ThumbnailArea = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid ${Line.subtle};
`;

const SkeletonThumbnail = styled.div<{ ratio: number }>`
  width: 100%;
  aspect-ratio: ${(props) => props.ratio};
  background-color: rgba(112, 115, 124, 0.05);
  animation: ${skeletonPulse} 1.5s ease-in-out infinite;
`;

const TOGGLE_RESERVED_WIDTH = 28;

const Overlay = styled.div<{ padding: number; reserveToggle: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: ${(props) => props.padding}px;
  padding-right: ${(props) => props.padding + (props.reserveToggle ? TOGGLE_RESERVED_WIDTH : 0)}px;
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 100%);
  pointer-events: none;
`;

const OverlayCaption = styled.p<{ fontSize: number; lineHeight: number; letterSpacing: string }>`
  position: relative;
  flex: 1 0 0;
  min-width: 0;
  margin: 0;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0px 0px 12px rgba(0, 0, 0, 0.16);
  font-size: ${(props) => props.fontSize}px;
  line-height: ${(props) => props.lineHeight};
  letter-spacing: ${(props) => props.letterSpacing};
`;

const ToggleButtonSlot = styled.div<{ offset: number }>`
  position: absolute;
  top: ${(props) => props.offset}px;
  right: ${(props) => props.offset}px;
`;

const ToggleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
`;

const Container = styled.div<{ gap: number; paddingX: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => props.gap}px;
  width: 100%;
  padding: 0 ${(props) => props.paddingX}px;
`;

const SlotContent = styled.div`
  width: 100%;
`;

const Content = styled.div<{ gap: number }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => props.gap}px;
  width: 100%;
`;

const Title = styled.p<{ $style: (typeof PLATFORM_STYLE)[keyof typeof PLATFORM_STYLE] }>`
  margin: 0;
  width: 100%;
  color: ${Label.normal};
  font-size: ${(props) => props.$style.titleFontSize}px;
  line-height: ${(props) => props.$style.titleLineHeight};
  letter-spacing: ${(props) => props.$style.titleLetterSpacing};
  font-weight: ${(props) => props.$style.titleFontWeight};
`;

const Caption = styled.p<{ $style: (typeof PLATFORM_STYLE)[keyof typeof PLATFORM_STYLE] }>`
  margin: 0;
  width: 100%;
  color: ${Label.alternative};
  font-size: ${(props) => props.$style.captionFontSize}px;
  line-height: ${(props) => props.$style.captionLineHeight};
  letter-spacing: ${(props) => props.$style.captionLetterSpacing};
  font-weight: ${(props) => props.$style.captionFontWeight};
`;
