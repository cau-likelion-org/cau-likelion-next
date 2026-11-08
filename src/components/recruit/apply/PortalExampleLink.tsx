import { useRef, useState } from 'react';
import styled from 'styled-components';

import Tooltip from '@common/tooltip/Tooltip';
import useOutsideClick from 'src/hooks/useOutsideClick';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const PortalExampleLink = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClick(wrapperRef, () => setIsOpen(false), isOpen);

  return (
    <div ref={wrapperRef}>
      <LinkButton type="button" aria-expanded={isOpen} onClick={() => setIsOpen((prev) => !prev)}>
        예시 이미지 보기
      </LinkButton>
      {isOpen && (
        <Popover text="정보가 잘 보이게 캡쳐해주세요." position="right">
          {/* 실제 예시 캡처 이미지를 받기 전까지 Figma와 같은 자리표시로 둔다 */}
          <ExampleImage>포탈화면</ExampleImage>
        </Popover>
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
