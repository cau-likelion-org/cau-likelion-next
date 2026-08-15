import styled from 'styled-components';

import { BackgroundLight, Orange } from '@utils/constant/color';

export interface LinearLoadingProps {
  className?: string;
  width?: number;
}

const LinearLoading = ({ className, width = 240 }: LinearLoadingProps) => {
  return (
    <Track className={className} style={{ width }} role="status" aria-label="로딩 중">
      <Bar />
    </Track>
  );
};

export default LinearLoading;

const Track = styled.div`
  position: relative;
  height: 10px;
  border-radius: 100px;
  background-color: ${BackgroundLight.tertiary};
  overflow: hidden;
`;

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 40%;
  height: 100%;
  border-radius: 100px;
  background-color: ${Orange.o200};
  animation: slide 1.2s ease-in-out infinite;

  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(350%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    left: 30%;
  }
`;
