import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useDragIndexCarousel, useInterval } from '@rapiders/react-hooks';
import { track, getDeviceType, getPageEntryTime } from 'src/lib/amplitude';

const Carousel = ({ images }: { images: string[] }) => {
  const router = useRouter();
  const { CarouselWrapper, ref, next, index, isDragging } = useDragIndexCarousel(images.length, { infinity: true });
  const { stop, continueTimer } = useInterval(next, 3000);

  useEffect(() => {
    if (isDragging) stop();
    else continueTimer();
  }, [isDragging]);

  const handleImageLoad = () => {
    track('Image Load Completed', {
      page_path: router.asPath,
      load_duration_ms: Date.now() - getPageEntryTime(),
      image_count: images.length,
      device_type: getDeviceType(),
    });
  };

  return (
    <Wrapper>
      <CarouselWrapper ref={ref} className="carouselWrapper">
        {images.map((img) => (
          <div style={{ width: '100%', backgroundColor: 'white' }} key={img}>
            <img
              src={img}
              draggable={false}
              style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              onLoad={handleImageLoad}
            />
          </div>
        ))}
      </CarouselWrapper>
      <DiamondWrapper>
        {Array.from({ length: images.length }, (_, i) => i).map((i) => (
          <Diamond key={i} color={index === i ? '#1a21bd' : '#F0F1FF'} />
        ))}
      </DiamondWrapper>
    </Wrapper>
  );
};

export default Carousel;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
`;


const DiamondWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const Diamond = styled.div`
  width: 7px;
  height: 7px;
  margin-right: 15px;

  background: ${(props) => props.color};
  transform: rotate(45deg);
`;
