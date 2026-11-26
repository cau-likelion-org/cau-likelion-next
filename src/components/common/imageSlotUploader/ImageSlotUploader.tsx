import { MouseEvent, useRef } from 'react';
import styled, { css } from 'styled-components';

import ThumbnailPlaceholder from '@common/thumbnail/ThumbnailPlaceholder';
import { IcAdd, IcCloseCircle } from '@assets/svg';
import useImageSlots from 'src/hooks/useImageSlots';
import { AccentTint, BackgroundColor, Fill, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

type ImageSlots = Pick<
  ReturnType<typeof useImageSlots>,
  'images' | 'featuredIndex' | 'isDragging' | 'isDropTarget' | 'addFiles' | 'removeImage' | 'thumbnailProps'
>;

interface ImageSlotUploaderProps {
  slots: ImageSlots;
  maxCount: number;
  addable?: boolean;
}

const ImageSlotUploader = ({ slots, maxCount, addable = false }: ImageSlotUploaderProps) => {
  const { images, featuredIndex, isDragging, isDropTarget, addFiles, removeImage, thumbnailProps } = slots;
  const featuredImage = images[featuredIndex];

  const rowRef = useRef<HTMLDivElement>(null);
  const rowScrollDragRef = useRef<{ startX: number; scrollLeft: number } | null>(null);

  const handleRowMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest('[data-thumbnail-index]')) return;
    const row = rowRef.current;
    if (!row) return;
    rowScrollDragRef.current = { startX: event.clientX, scrollLeft: row.scrollLeft };
  };

  const handleRowMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const dragState = rowScrollDragRef.current;
    const row = rowRef.current;
    if (!dragState || !row) return;
    row.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.startX);
  };

  const handleRowMouseUp = () => {
    rowScrollDragRef.current = null;
  };

  return (
    <Root>
      <MainThumbnail as={featuredImage ? 'div' : 'label'} $empty={!featuredImage}>
        {featuredImage ? (
          <MainThumbnailImage src={featuredImage} alt="대표 이미지" />
        ) : (
          <>
            <UploadGuide>
              사진을 {maxCount}장까지 업로드하고
              <br />
              표지가 되는 대표사진을 선택해주세요
            </UploadGuide>
            <HiddenFileInput
              type="file"
              accept="image/*"
              multiple
              aria-label="대표 이미지 선택"
              onChange={(event) => addFiles(featuredIndex, event)}
            />
          </>
        )}
        <FeaturedChip>대표</FeaturedChip>
      </MainThumbnail>
      <ThumbnailRow
        ref={rowRef}
        $scrollable={addable}
        {...(addable && {
          onMouseDown: handleRowMouseDown,
          onMouseMove: handleRowMouseMove,
          onMouseUp: handleRowMouseUp,
          onMouseLeave: handleRowMouseUp,
        })}
      >
        {addable && images.includes(null) && (
          <AddSlot>
            <IcAdd width={24} height={24} />
            <HiddenFileInput
              type="file"
              accept="image/*"
              multiple
              aria-label="이미지 추가"
              onChange={(event) => addFiles(0, event)}
            />
          </AddSlot>
        )}
        {images.map((image, index) => {
          if (image) {
            return (
              <ThumbnailSlot
                key={index}
                as="div"
                role="button"
                tabIndex={0}
                data-thumbnail-index={index}
                $featured={index === featuredIndex}
                $dragging={isDragging(index)}
                $dropTarget={isDropTarget(index)}
                aria-label={`${index + 1}번째 이미지를 대표사진으로 설정`}
                {...thumbnailProps(index)}
              >
                <ThumbnailImage src={image} alt="" draggable={false} />
                <RemoveButton
                  type="button"
                  aria-label={`${index + 1}번째 이미지 삭제`}
                  onClick={(event) => {
                    event.stopPropagation();
                    removeImage(index);
                  }}
                >
                  <IcCloseCircle width={26} height={26} />
                </RemoveButton>
              </ThumbnailSlot>
            );
          }
          if (addable) return null;
          return (
            <ThumbnailSlot key={index} $featured={false}>
              <EmptyThumbnail />
              <HiddenFileInput
                type="file"
                accept="image/*"
                multiple
                aria-label={`이미지 ${index + 1} 선택`}
                onChange={(event) => addFiles(index, event)}
              />
            </ThumbnailSlot>
          );
        })}
      </ThumbnailRow>
    </Root>
  );
};

export default ImageSlotUploader;

const SLOT_WIDTH = 160;
const SLOT_HEIGHT = 90;
const SLOT_RADIUS = 4;
const REMOVE_BUTTON_SIZE = 26;
const REMOVE_BUTTON_OFFSET = -5;
const FEATURED_OUTLINE = 2;

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 46px;
`;

const MainThumbnail = styled.label<{ $empty: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 22px;
  background-color: ${(props) => (props.$empty ? '#f4f4f5' : '#f5f7f9')};
  cursor: ${(props) => (props.$empty ? 'pointer' : 'default')};
`;

const MainThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const UploadGuide = styled.p`
  ${typographyCss(Typography.body2Normal.regular)}
  color: ${Orange.o500};
  text-align: center;
  margin: 0;
`;

const FeaturedChip = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 9px 12px;
  border-radius: 10px;
  background-color: ${Orange.o50};
  box-shadow:
    inset 0 0 0 9999px rgba(255, 96, 0, 0.05),
    inset 0 0 0 1px ${AccentTint.border};
  color: ${Orange.o500};
  ${typographyCss(Typography.body2Normal.medium)}
`;

const SCROLL_BLEED_TOP_RIGHT = -REMOVE_BUTTON_OFFSET + 1;

const ThumbnailRow = styled.div<{ $scrollable: boolean }>`
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 20px;

  ${(props) =>
    props.$scrollable &&
    css`
      padding: ${SCROLL_BLEED_TOP_RIGHT}px ${SCROLL_BLEED_TOP_RIGHT}px ${FEATURED_OUTLINE}px ${FEATURED_OUTLINE}px;
      margin: -${SCROLL_BLEED_TOP_RIGHT}px -${SCROLL_BLEED_TOP_RIGHT}px -${FEATURED_OUTLINE}px -${FEATURED_OUTLINE}px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      cursor: grab;

      &::-webkit-scrollbar {
        display: none;
      }
    `}
`;

const slotBox = css`
  position: relative;
  flex-shrink: 0;
  width: ${SLOT_WIDTH}px;
  height: ${SLOT_HEIGHT}px;
`;

const AddSlot = styled.label`
  ${slotBox}
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${Fill.normal};
  color: ${Label.neutral};
  cursor: pointer;
`;

const ThumbnailSlot = styled.label<{ $featured: boolean; $dragging?: boolean; $dropTarget?: boolean }>`
  ${slotBox}
  display: flex;
  border-radius: ${SLOT_RADIUS}px;
  background-color: ${Fill.subtle};
  outline: ${(props) =>
    props.$featured
      ? `${FEATURED_OUTLINE}px solid ${Orange.o500}`
      : props.$dropTarget
        ? `${FEATURED_OUTLINE}px dashed ${Orange.o500}`
        : 'none'};
  opacity: ${(props) => (props.$dragging ? 0.4 : 1)};
  cursor: pointer;
`;

const EmptyThumbnail = styled(ThumbnailPlaceholder)`
  border-radius: ${SLOT_RADIUS}px;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: ${SLOT_RADIUS}px;
  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${REMOVE_BUTTON_OFFSET}px;
  right: ${REMOVE_BUTTON_OFFSET}px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${REMOVE_BUTTON_SIZE}px;
  height: ${REMOVE_BUTTON_SIZE}px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${BackgroundColor};
  color: ${Orange.o500};
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;
