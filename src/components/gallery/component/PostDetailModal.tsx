import { useId, useRef } from 'react';
import styled from 'styled-components';

import Button from '@common/button/Button';
import ContentBadge from '@common/badge/ContentBadge';
import Chip from '@common/chip/Chip';
import TextButton from '@common/textButton/TextButton';
import ProjectDetailCarousel from '@project/detail/ProjectDetailCarousel';
import IcLineHorizontal from '@assets/svg/icon/ic-line-horizontal.svg';
import { IcChevronLeft } from '@assets/svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundColor, Label, Material, Orange } from '@utils/constant/color';
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
            <ProjectDetailCarousel key={imageUrls.join(',')} images={imageUrls} />
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

          {Array.isArray(date) && date[0] !== date[1] ? (
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
              {Array.isArray(date) ? date[0] : date}
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
  ${typographyCss(Typography.headline1.regular)}
  color: ${Label.normal};
  margin: 0;
  white-space: pre-line;
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
