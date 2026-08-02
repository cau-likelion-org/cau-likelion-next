import { useDragIndexCarousel, useInterval } from '@rapiders/react-hooks';
import { Orange } from '@utils/constant/color';
import Image from 'next/image';
import { useEffect } from 'react';
import styled from 'styled-components';

const ProjectDetailCarousel = ({ images }: { images: string[] }) => {
  const { CarouselWrapper, ref, next, index, isDragging } = useDragIndexCarousel(images.length, { infinity: true });
  const { stop, continueTimer } = useInterval(next, 4000);

  useEffect(() => {
    if (isDragging) stop();
    else continueTimer();
  }, [isDragging]);

  return (
    <Wrapper>
      <ThumbnailFrame>
        <CarouselWrapper ref={ref} style={{ width: '100%', height: '100%' }}>
          {images.map((image) => (
            <ImageSlide key={image}>
              <Image
                src={image}
                alt="프로젝트 이미지"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                draggable={false}
              />
            </ImageSlide>
          ))}
        </CarouselWrapper>
      </ThumbnailFrame>
      {images.length > 1 && (
        <Dots>
          {images.map((image, i) => (
            <Dot key={image} $active={index === i} />
          ))}
        </Dots>
      )}
    </Wrapper>
  );
};

export default ProjectDetailCarousel;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  width: 100%;
`;

const ThumbnailFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1060 / 596.25;
  border-radius: 22px;
  overflow: hidden;
  background-color: #f5f7f9;
`;

const ImageSlide = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background-color: ${Orange.o500};
  opacity: ${(props) => (props.$active ? 1 : 0.16)};
`;
