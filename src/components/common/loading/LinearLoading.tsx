import styled, { css, keyframes } from 'styled-components';

import { BackgroundLight, Orange } from '@utils/constant/color';

export interface LinearLoadingProps {
  className?: string;
  width?: number;
  /** 0~1. 완료된 항목 수 / 전체 항목 수처럼 실제 로딩 진행률을 알 수 있을 때만 전달. 모르면 생략 */
  progress?: number;
}

const LinearLoading = ({ className, width = 240, progress }: LinearLoadingProps) => {
  return (
    <Track className={className} style={{ width }} role="status" aria-label="로딩 중">
      <Bar $progress={progress} />
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

// 실제 진행률을 알 수 없을 때 쓰는 대체 애니메이션: 뒤로 가지 않고 90%까지만 채운 뒤 멈춰서
// 실제 로딩이 끝나 콘텐츠로 교체될 때까지 기다림 (리셋/반복 없음)
const trickle = keyframes`
  0% {
    width: 0%;
  }
  20% {
    width: 45%;
  }
  50% {
    width: 68%;
  }
  100% {
    width: 90%;
  }
`;

const Bar = styled.div<{ $progress?: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 100px;
  background-color: ${Orange.o200};

  ${(props) =>
    props.$progress === undefined
      ? css`
          animation: ${trickle} 6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        `
      : css`
          width: ${props.$progress * 100}%;
          transition: width 0.3s ease-out;
        `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    width: ${(props) => (props.$progress === undefined ? 40 : props.$progress * 100)}%;
  }
`;
