import { ReactNode, RefObject, useRef } from 'react';
import styled from 'styled-components';

import ModalOverlay from '@common/modalOverlay/ModalOverlay';
import ScrollArea from '@common/scrollArea/ScrollArea';
import useFocusTrap from 'src/hooks/useFocusTrap';
import { BackgroundColor, Label, State } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface EmailModalLayoutProps {
  ariaLabel: string;
  onClose: () => void;
  actions: ReactNode;
  children: ReactNode;
  modalRef?: RefObject<HTMLDivElement>;
}

const EmailModalLayout = ({ ariaLabel, onClose, actions, children, modalRef }: EmailModalLayoutProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const ref = modalRef ?? innerRef;
  useFocusTrap(ref, onClose);

  return (
    <ModalOverlay onDimmerClick={onClose}>
      <Modal ref={ref} role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1}>
        <InformationScroll>
          <Information>{children}</Information>
        </InformationScroll>
        {actions}
      </Modal>
    </ModalOverlay>
  );
};

export default EmailModalLayout;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const LargeHeading = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  color: ${Label.neutral};
  ${typographyCss(Typography.title3.bold)}
`;

export const LargeRequired = styled.span`
  color: ${State.error};
  ${typographyCss(Typography.title3.bold)}
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1040px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  background-color: ${BackgroundColor};
`;

const InformationScroll = styled(ScrollArea)`
  flex: 1 1 auto;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;
  padding: 28px;
`;
