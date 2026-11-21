import { useRef, useState } from 'react';
import styled from 'styled-components';

import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';
import TextButton from '@common/textButton/TextButton';
import Tooltip from '@common/tooltip/Tooltip';
import useOutsideClick from 'src/hooks/useOutsideClick';
import { Label } from '@utils/constant/color';
import { media, XS_MEDIA_QUERY } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';

const GUIDE = '정보가 잘 보이게 캡쳐해주세요.';

// 모바일은 입력칸 옆에 말풍선을 띄울 자리가 없어 모달로 보여준다
type ExampleView = 'popover' | 'modal';

const PortalExampleLink = () => {
  const [openView, setOpenView] = useState<ExampleView | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const close = () => setOpenView(null);
  useOutsideClick(wrapperRef, close, openView === 'popover');

  const toggle = () => {
    if (openView) return close();
    setOpenView(window.matchMedia(XS_MEDIA_QUERY).matches ? 'modal' : 'popover');
  };

  return (
    <div ref={wrapperRef}>
      <LinkButton type="button" aria-expanded={!!openView} onClick={toggle}>
        예시 이미지 보기
      </LinkButton>
      {openView === 'popover' && (
        <Popover text={GUIDE} position="right">
          {/* 실제 예시 캡처 이미지를 받기 전까지 Figma와 같은 자리표시로 둔다 */}
          <ExampleImage>포탈화면</ExampleImage>
        </Popover>
      )}
      {openView === 'modal' && (
        <Modal size="medium" ariaLabel={GUIDE} onClose={close}>
          <ModalInformation>
            <ModalBody>
              <ModalTitle>{GUIDE}</ModalTitle>
              <ModalExampleImage>포탈화면</ModalExampleImage>
            </ModalBody>
          </ModalInformation>
          <ModalActions>
            <TextButton onClick={close}>닫기</TextButton>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};

export default PortalExampleLink;

const LinkButton = styled.button`
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  color: ${Label.alternative};
  text-decoration: underline;
  cursor: pointer;
  ${typographyCss(Typography.body2Normal.regular)}

  ${media.xs} {
    ${typographyCss(Typography.caption1.medium)}
  }
`;

// 입력칸 제목 줄 오른쪽 20px 바깥에 띄운다
const Popover = styled(Tooltip)`
  position: absolute;
  top: -2px;
  left: calc(100% + 20px);
  z-index: 10;
`;

const ExampleImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 435px;
  background-color: #6a6a6a;
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.regular)}
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ModalExampleImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 162 / 352;
  background-color: rgba(106, 106, 106, 0.2);
  color: ${Label.strong};
  ${typographyCss(Typography.body1Normal.regular)}
`;
