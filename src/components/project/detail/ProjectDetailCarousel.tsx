import { Label } from '@utils/constant/color';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { track, getDeviceType } from 'src/lib/amplitude';

const TRANSITION_MS = 300;
// react-hooks/purity가 useRef 초기값으로 넘기는 Date.now() 호출을 막아서, 계측용 타임스탬프는 밖에서 받는다
const now = () => Date.now();

const ProjectDetailCarousel = ({ images }: { images: string[] }) => {
  const router = useRouter();
  const isLoopable = images.length > 1;
  const slides = isLoopable ? [...images, images[0]] : images;
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAnimated, setIsAnimated] = useState(true);
  const activeIndex = slideIndex % images.length;

  // 로드된 고유 이미지 수를 세되, 루프용으로 복제한 마지막 슬라이드는 중복 카운트하지 않는다
  const imageLoadRef = useRef({ loadedCount: 0, startedAt: 0, fired: false });
  useEffect(() => {
    imageLoadRef.current = { loadedCount: 0, startedAt: now(), fired: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join(',')]);

  const handleImageLoad = () => {
    const state = imageLoadRef.current;
    state.loadedCount += 1;
    if (state.fired || state.loadedCount < images.length) return;
    state.fired = true;
    track('Image Load Completed', {
      page_path: router.asPath,
      load_duration_ms: now() - state.startedAt,
      image_count: images.length,
      device_type: getDeviceType(),
    });
  };

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
                style={{ objectFit: 'contain', objectPosition: 'center' }}
                draggable={false}
                // 루프용으로 복제한 마지막 슬라이드(index === images.length)는 로드를 세지 않는다
                // 그 slide가 먼저 끝나면 실제 마지막 원본 이미지가 로드되기 전에 완료로 잡힐 수 있다
                onLoad={index < images.length ? handleImageLoad : undefined}
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
