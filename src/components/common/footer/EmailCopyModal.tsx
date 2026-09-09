import { useId, useRef } from 'react';
import styled from 'styled-components';

import ScrollArea from '@common/scrollArea/ScrollArea';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundColor, Label, Material, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

const EmailCopyModal = ({ email, onClose }: { email: string; onClose: () => void }) => {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, onClose);

  const handleCopyAgain = () => {
    navigator.clipboard.writeText(email);
  };

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
        <InformationScroll>
          <Information>
            <Title id={titleId}>이메일이 복사되었습니다</Title>
            <EmailButton type="button" onClick={handleCopyAgain}>
              {email}
            </EmailButton>
          </Information>
        </InformationScroll>
        <Actions>
          <CloseButton type="button" onClick={onClose}>
            닫기
          </CloseButton>
        </Actions>
      </Modal>
    </Backdrop>
  );
};

export default EmailCopyModal;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-color: ${Material.dimmer};
  z-index: 9999;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);
  outline: none;
  z-index: 10000;

  ${media.xs} {
    border-radius: 16px;
  }
`;

const InformationScroll = styled(ScrollArea)`
  width: 100%;
`;

const Information = styled.div`
  width: 100%;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  ${media.xs} {
    padding: 28px;
    align-items: flex-start;
    gap: 8px;
  }
`;

const Title = styled.p`
  ${typographyCss(Typography.headline1.bold)}
  color: ${Label.normal};
  margin: 0;

  ${media.xs} {
    ${typographyCss(Typography.heading2.bold)}
    width: 100%;
  }
`;

const EmailButton = styled.button`
  width: 100%;
  padding: 4px 0;
  ${typographyCss(Typography.headline2.medium)}
  color: ${Label.strong};
  text-align: center;
  background-color: rgba(255, 96, 0, 0.04);
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Actions = styled.div`
  width: 100%;
  padding: 0 20px 12px;
  display: flex;
  justify-content: flex-end;

  ${media.xs} {
    padding: 0 28px 20px;
  }
`;

const CloseButton = styled.button`
  ${typographyCss(Typography.body1Normal.bold)}
  color: ${Orange.o500};
  background: none;
  border: none;
  cursor: pointer;

  ${media.xs} {
    padding: 4px 0;
  }
`;
