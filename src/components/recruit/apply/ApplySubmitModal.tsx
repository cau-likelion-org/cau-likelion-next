import styled from 'styled-components';

import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

const TITLE = '제출 후에는 수정 및 재제출이 불가합니다.\n제출하시겠습니까?';
const LATE_TITLE = '마감 기한이 초과되어\n평가 시 불이익이 발생할 수 있습니다.\n제출하시겠습니까?';
// 모바일은 모달 폭이 좁아 Figma에서 줄을 다르게 나눈다
const MOBILE_TITLE = '제출 후에는\n수정 및 재제출이 불가합니다.\n제출하시겠습니까?';
const MOBILE_LATE_TITLE = '마감 기한이 초과되어 평가 시\n불이익이 발생할 수 있습니다.\n제출하시겠습니까?';

export interface ApplySubmitModalProps {
  isLate: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ApplySubmitModal = ({ isLate, loading, onCancel, onConfirm }: ApplySubmitModalProps) => {
  const title = isLate ? LATE_TITLE : TITLE;

  return (
    <SubmitModal ariaLabel={title} onClose={onCancel}>
      <Information align="center">
        <WebTitle>{title}</WebTitle>
        <MobileTitle>{isLate ? MOBILE_LATE_TITLE : MOBILE_TITLE}</MobileTitle>
      </Information>
      <Actions>
        <TextButton color="assistive" onClick={onCancel}>
          취소
        </TextButton>
        <TextButton loading={loading} onClick={onConfirm}>
          제출하기
        </TextButton>
      </Actions>
    </SubmitModal>
  );
};

export default ApplySubmitModal;

// 모바일 Figma는 이 모달을 medium 규격(모서리 16px, 여백 28px, 제목 Heading 2)으로 그린다
const SubmitModal = styled(Modal)`
  ${media.xs} {
    && {
      border-radius: 16px;
    }
  }
`;

const Information = styled(ModalInformation)`
  ${media.xs} {
    && {
      padding: 28px;
    }
  }
`;

const Title = styled(ModalTitle)`
  white-space: pre-line;

  ${media.xs} {
    && {
      ${typographyCss(Typography.heading2.bold)}
    }
  }
`;

const WebTitle = styled(Title)`
  ${media.xs} {
    display: none;
  }
`;

const MobileTitle = styled(Title)`
  display: none;

  ${media.xs} {
    display: block;
  }
`;

const Actions = styled(ModalActions)`
  ${media.xs} {
    && {
      padding: 0 28px 20px;
    }
  }
`;
