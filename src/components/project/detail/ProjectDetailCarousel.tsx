import { Label } from '@utils/constant/color';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ProjectDetailCarousel = ({ images }: { images: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Wrapper>
      <ThumbnailFrame>
        <SlideTrack style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
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
              onClick={() => setActiveIndex(i)}
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
  transition: transform 300ms ease-out;
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
  width: 10px;
  height: 10px;

  @media (max-width: 700px) {
    width: 6px;
    height: 6px;
  }
  padding: 0;
  border: none;
  border-radius: 999px;
  background-color: ${Label.normal};
  opacity: ${(props) => (props.$active ? 1 : 0.16)};
  cursor: pointer;
`;
