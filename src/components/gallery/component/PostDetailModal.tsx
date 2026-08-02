import { useId, useRef } from 'react';
import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import Chip from '@common/chip/Chip';
import PaginationDots from '@common/pagination/PaginationDots';
import TextButton from '@common/textButton/TextButton';
import IcLineHorizontal from '@assets/svg/ic-line-horizontal.svg';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundColor, Fill, Label, Material } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface PostDetailModalProps {
  title: string;
  badges: string[];
  description: string;
  date: string | [string, string];
  imageCount?: number;
  onEdit: () => void;
  onClose: () => void;
}

const PostDetailModal = ({
  title,
  badges,
  description,
  date,
  imageCount = 4,
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
        <Information>
          <ImageGroup>
            <MainThumbnail />
            <PaginationDots total={imageCount} current={0} size="medium" />
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
          <TextButton color="assistive" onClick={onEdit}>
            수정
          </TextButton>
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
  width: 1040px;
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
`;

const Information = styled.div`
  width: 100%;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 42px;
`;

const ImageGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
`;

const MainThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 22px;
  background-color: ${Fill.subtle};
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
`;
