import { useId, useRef, useState } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import Chip from '@common/chip/Chip';
import PaginationDots from '@common/pagination/PaginationDots';
import TextButton from '@common/textButton/TextButton';
import IcLineHorizontal from '@assets/svg/icon/ic-line-horizontal.svg';
import { IcChevronLeft, IcChevronRight } from '@assets/svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundColor, Fill, Label, Material, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface PostDetailModalProps {
  title: string;
  headerTitle: string;
  badges: string[];
  description: string;
  date: string | [string, string];
  imageUrls: string[];
  onEdit?: () => void;
  onClose: () => void;
}

const PostDetailModal = ({
  title,
  headerTitle,
  badges,
  description,
  date,
  imageUrls,
  onEdit,
  onClose,
}: PostDetailModalProps) => {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prevImageUrls, setPrevImageUrls] = useState(imageUrls);
  if (imageUrls !== prevImageUrls) {
    setPrevImageUrls(imageUrls);
    setActiveIndex(0);
  }

  const showNavigation = imageUrls.length > 1;
  const goToPrev = () => setActiveIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  const goToNext = () => setActiveIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));

  return (
    <Backdrop onClick={onClose}>
      <Modal
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <MobileHeader>
          <Button
            variant="outlined"
            color="assistive"
            size="small"
            leadingIcon={<IcChevronLeft width={16} height={16} />}
            onClick={onClose}
          >
            닫기
          </Button>
          <MobileTitle>{headerTitle}</MobileTitle>
        </MobileHeader>
        <Information>
          <ImageGroup>
            <MainThumbnail>
              {imageUrls.length > 0 && <MainThumbnailImage src={imageUrls[activeIndex]} alt="" />}
              {showNavigation && (
                <>
                  <NavButton type="button" aria-label="이전 이미지" $side="left" onClick={goToPrev}>
                    <IcChevronLeft width={20} height={20} />
                  </NavButton>
                  <NavButton type="button" aria-label="다음 이미지" $side="right" onClick={goToNext}>
                    <IcChevronRight width={20} height={20} />
                  </NavButton>
                </>
              )}
            </MainThumbnail>
            {showNavigation && <Dots total={imageUrls.length} current={activeIndex} size="medium" />}
          </ImageGroup>

          <TextGroup>
            <Title id={titleId}>{title}</Title>
            <BadgeRow>
              {badges.map((badge) => (
                <ContentBadge key={badge} text={badge} color="accent" size="medium" />
              ))}
            </BadgeRow>
            <Description>{description}</Description>
          </TextGroup>

          {Array.isArray(date) ? (
            <DateRangeRow>
              <Chip variant="filled" size="small">
                {date[0]}
              </Chip>
              <DateRangeDivider width={16} height={16} />
              <Chip variant="filled" size="small">
                {date[1]}
              </Chip>
            </DateRangeRow>
          ) : (
            <Chip variant="filled" size="small">
              {date}
            </Chip>
          )}
        </Information>
        <Actions>
          {onEdit && (
            <TextButton color="assistive" onClick={onEdit}>
              수정
            </TextButton>
          )}
          <TextButton color="primary" onClick={onClose}>
            닫기
          </TextButton>
        </Actions>
      </Modal>
    </Backdrop>
  );
};

export default PostDetailModal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Material.dimmer};
  z-index: 9999;
`;

const Modal = styled.div`
  width: 568px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  background-color: ${BackgroundColor};
  outline: none;
  z-index: 10000;

  ${media.md} {
    width: 711px;
  }

  ${media.lg} {
    width: 800px;
  }

  @media (max-width: 700px) {
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    border-radius: 0;
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 700px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 52px 20px;
  }
`;

const MobileTitle = styled.p`
  margin: 0;
  color: ${Orange.o500};
  ${typographyCss(Typography.title2.bold)}
`;

const Dots = styled(PaginationDots)`
  @media (max-width: 700px) {
    span {
      width: 6px;
      height: 6px;
    }
  }
`;

const Information = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;

  @media (max-width: 700px) {
    padding: 0 20px 60px;
  }
`;

const ImageGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
`;

const MainThumbnail = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 22px;
  overflow: hidden;
  background-color: ${Fill.subtle};
`;

const MainThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NavButton = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.$side === 'left' ? 'left: 16px;' : 'right: 16px;')}
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: ${BackgroundColor};
  color: ${Label.normal};
  padding: 0;
  cursor: pointer;
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
  margin: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Description = styled.p`
  ${typographyCss(Typography.heading2.medium)}
  color: ${Label.normal};
  margin: 0;
`;

const DateRangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DateRangeDivider = styled(IcLineHorizontal)`
  flex-shrink: 0;
  color: ${Label.assistive};
`;

const Actions = styled.div`
  width: 100%;
  padding: 0 28px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 24px;

  @media (max-width: 700px) {
    display: none;
  }
`;
