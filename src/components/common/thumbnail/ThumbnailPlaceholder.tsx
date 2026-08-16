import styled from 'styled-components';

import { IcImage } from '@assets/svg';
import { Line } from '@utils/constant/color';

export interface ThumbnailPlaceholderProps {
  className?: string;
  ratio?: number;
  radius?: boolean;
  border?: boolean;
}

/**
 * 썸네일이 없거나 로드에 실패했을 때 자리를 지키는 빈 상태.
 * 시안: Figma Card/Card 22:2635 — 배경 #F5F5F5, 아이콘 #E7E7E7, 아이콘 폭은 컨테이너의 25.8%.
 * 프로젝트 토큰 중 가장 가까운 Line.alternative(#F4F4F5) / Line.neutral(#EAEBEC)로 매핑했다.
 */
const ThumbnailPlaceholder = ({ className, ratio, radius = false, border = false }: ThumbnailPlaceholderProps) => (
  <Wrapper className={className} $ratio={ratio} $radius={radius} $border={border} aria-hidden="true">
    <IcImage />
  </Wrapper>
);

export default ThumbnailPlaceholder;

const Wrapper = styled.div<{ $ratio?: number; $radius: boolean; $border: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${(props) => (props.$ratio ? `aspect-ratio: ${props.$ratio};` : 'height: 100%;')}
  border-radius: ${(props) => (props.$radius ? '12px' : '0')};
  border: ${(props) => (props.$border ? `1px solid ${Line.subtle}` : 'none')};
  background-color: ${Line.alternative};
  color: ${Line.neutral};

  svg {
    width: 25.8%;
    height: auto;
  }
`;
