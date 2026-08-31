import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { Material } from '@utils/constant/color';

export interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  onDimmerClick?: () => void;
  children: ReactNode;
}

// NavBar(9999)·PageScrollbar(9998)보다 항상 위에 오도록 모든 모달이 이 z-index를 공유한다
const MODAL_Z_INDEX = 10000;

const ModalOverlay = ({ onDimmerClick, children, ...rest }: ModalOverlayProps) => (
  <Overlay {...rest}>
    <Dimmer onClick={onDimmerClick} />
    {children}
  </Overlay>
);

export default ModalOverlay;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: ${MODAL_Z_INDEX};
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${Material.dimmer};
  opacity: 0.43;
`;
