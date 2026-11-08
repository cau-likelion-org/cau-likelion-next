import styled from 'styled-components';

import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';
import { Label } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

const EmailCopyModal = ({ email, onClose }: { email: string; onClose: () => void }) => {
  const handleCopyAgain = () => {
    navigator.clipboard.writeText(email);
  };

  return (
    <StyledModal ariaLabel="이메일이 복사되었습니다" onClose={onClose}>
      <Information align="center">
        <Title>이메일이 복사되었습니다</Title>
        <EmailButton type="button" onClick={handleCopyAgain}>
          {email}
        </EmailButton>
      </Information>
      <Actions>
        <TextButton onClick={onClose}>닫기</TextButton>
      </Actions>
    </StyledModal>
  );
};

export default EmailCopyModal;

// 데스크톱은 small 규격, 모바일은 medium 규격으로 그린다
const StyledModal = styled(Modal)`
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);

  ${media.xs} {
    border-radius: 16px;
  }
`;

const Information = styled(ModalInformation)`
  && {
    gap: 12px;

    ${media.xs} {
      align-items: flex-start;
      gap: 8px;
      padding: 28px;
      text-align: left;
    }
  }
`;

const Title = styled(ModalTitle)`
  ${media.xs} {
    && {
      width: 100%;
      ${typographyCss(Typography.heading2.bold)}
    }
  }
`;

const EmailButton = styled.button`
  position: relative;
  width: 100%;
  padding: 4px 0;
  ${typographyCss(Typography.headline2.medium)}
  color: ${Label.strong};
  text-align: center;
  background: none;
  border: none;
  cursor: pointer;

  /* Figma Button/Text의 Interaction 레이어: 버튼보다 좌우 7px 넓게 깔린다 */
  &::before {
    content: '';
    position: absolute;
    inset: 0 -7px;
    border-radius: 6px;
    background-color: rgba(255, 96, 0, 0.04);
    pointer-events: none;
  }
`;

const Actions = styled(ModalActions)`
  ${media.xs} {
    && {
      padding: 0 28px 20px;
    }
  }
`;
