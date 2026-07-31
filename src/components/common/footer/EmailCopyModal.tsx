import styled from 'styled-components';

import { BackgroundColor, Label, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const EmailCopyModal = ({ email, onClose }: { email: string; onClose: () => void }) => {
  const handleCopyAgain = () => {
    navigator.clipboard.writeText(email);
  };

  return (
    <Modal>
      <Information>
        <Title>이메일이 복사되었습니다</Title>
        <EmailButton type="button" onClick={handleCopyAgain}>
          {email}
        </EmailButton>
      </Information>
      <Actions>
        <CloseButton type="button" onClick={onClose}>
          닫기
        </CloseButton>
      </Actions>
    </Modal>
  );
};

export default EmailCopyModal;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  background-color: ${BackgroundColor};
  box-shadow:
    0px 10px 15px -3px rgba(23, 23, 23, 0.07),
    0px 4px 6px -2px rgba(23, 23, 23, 0.07);
  z-index: 10000;
`;

const Information = styled.div`
  width: 100%;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Title = styled.p`
  ${typographyCss(Typography.headline1.bold)}
  color: ${Label.normal};
  margin: 0;
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
`;

const CloseButton = styled.button`
  ${typographyCss(Typography.body1Normal.bold)}
  color: ${Orange.o500};
  background: none;
  border: none;
  cursor: pointer;
`;
