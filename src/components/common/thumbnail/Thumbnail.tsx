import type { ReactNode } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Line } from '@utils/constant/color';

export interface ThumbnailProps {
  className?: string;
  src: string;
  alt?: string;
  ratio?: number;
  radius?: boolean;
  border?: boolean;
  overlay?: ReactNode;
  sizes?: string;
  onError?: () => void;
}

const Thumbnail = ({
  className,
  src,
  alt = '',
  ratio = 1,
  radius = false,
  border = false,
  overlay,
  sizes = '100vw',
  onError,
}: ThumbnailProps) => {
  return (
    <Wrapper className={className} $ratio={ratio} $radius={radius} $border={border}>
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: 'cover' }}
        referrerPolicy="no-referrer"
        onError={onError}
      />
      {overlay && <Overlay>{overlay}</Overlay>}
    </Wrapper>
  );
};

export default Thumbnail;

const Wrapper = styled.div<{ $ratio: number; $radius: boolean; $border: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${(props) => props.$ratio};
  overflow: hidden;
  border-radius: ${(props) => (props.$radius ? '12px' : '0')};
  border: ${(props) => (props.$border ? `1px solid ${Line.normal}` : 'none')};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
