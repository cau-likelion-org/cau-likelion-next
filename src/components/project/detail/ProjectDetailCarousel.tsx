import { Label } from '@utils/constant/color';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const TRANSITION_MS = 300;

const ProjectDetailCarousel = ({ images }: { images: string[] }) => {
  const isLoopable = images.length > 1;
  const slides = isLoopable ? [...images, images[0]] : images;
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(true);
  const activeIndex = slideIndex % images.length;

  useEffect(() => {
    if (!isLoopable) return undefined;
    const timer = setInterval(() => {
      setSlideIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [isLoopable]);

  useEffect(() => {
    if (slideIndex !== images.length) return undefined;
    const timer = setTimeout(() => {
      setIsAnimated(false);
      setSlideIndex(0);
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [slideIndex, images.length]);

  useEffect(() => {
    if (isAnimated) return undefined;
    let innerFrame = 0;
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setIsAnimated(true));
    });
    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [isAnimated]);

  return (
    <Wrapper>
      <ThumbnailFrame>
        <SlideTrack
          style={{ transform: `translateX(-${slideIndex * 100}%)`, transition: isAnimated ? undefined : 'none' }}
        >
          {slides.map((image, index) => (
            <ImageSlide key={`${image}-${index}`}>
              <Image
                src={image}
                alt="프로젝트 이미지"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                draggable={false}
              />
            </ImageSlide>
          ))}
        </SlideTrack>
      </ThumbnailFrame>
      {images.length > 1 && (
        <Dots>
          {images.map((image, i) => (
            <Dot
              key={image}
              type="button"
              aria-label={`${i + 1}번째 이미지 보기`}
              $active={activeIndex === i}
              onClick={() => setSlideIndex(i)}
            />
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

const SlideTrack = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform ${TRANSITION_MS}ms ease-out;
`;

const ImageSlide = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 700px) {
    gap: 12px;
  }
`;

const Dot = styled.button<{ $active: boolean }>`
  position: relative;
  width: 10px;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background-color: ${Label.normal};
  opacity: ${(props) => (props.$active ? 1 : 0.16)};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: -7px;
  }

  @media (max-width: 700px) {
    width: 6px;
    height: 6px;

    &::after {
      inset: -9px;
    }
  }
`;
