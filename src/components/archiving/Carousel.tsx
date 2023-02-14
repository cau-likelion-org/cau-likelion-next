import { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { useInterval } from 'src/hooks/useInterval';

const animateVariant = {
  initial: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      transition: {
        type: 'Tween',
        duration: 0.1,
      },
    };
  },
  animate: {
    x: 0,
    transition: {
      type: 'Tween',
      duration: 0.1,
    },
  },
  exit: (direction: number) => {
    return {
      x: direction < 0 ? 1000 : -1000,
      transition: {
        type: 'Tween',
        duration: 0.1,
      },
    };
  },
};
const Carousel = ({ images }: { images: string[] }) => {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [timerBool, setTimerBool] = useState(true);
  const [dragStartX, setdragStartX] = useState(0);
  useInterval(() => IndexControl(true), 3000, timerBool);

  const IndexControl = (direction: boolean) => {
    if (direction) setIndex((prev) => (prev[0] > images.length - 2 ? [0, +1] : [index + 1, +1]));
    else setIndex((prev) => (prev[0] < 1 ? [images.length - 1, -1] : [index - 1, -1]));
  };

  const handleScroll = (_: any, info: PanInfo) => {
    setTimerBool((prev) => (prev = true));
    IndexControl(dragStartX > info.point.x);
  };
  return (
    <Wrapper>
      <CarouselWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <ImageWrapper
            key={index}
            variants={animateVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            drag="x"
            onDragStart={(_, info) => {
              setTimerBool((prev) => (prev = false));
              setdragStartX((prev) => (prev = info.point.x));
            }}
            onDragEnd={handleScroll}
            custom={direction}
          >
            <CustomImage src={images[index]} alt="img" layout="fill" objectFit="cover" objectPosition="center" />
          </ImageWrapper>
        </AnimatePresence>
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

const CustomImage = styled(Image)`
  cursor: pointer;
  -webkit-user-drag: none;
`;
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50vh;
  border-radius: 30px;
  border: none;
  overflow: hidden;
`;
const DiamondWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
const ImageWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  border: none;
`;
const Diamond = styled.div`
  width: 7px;
  height: 7px;
  margin-right: 15px;

  background: ${(props) => props.color};
  transform: rotate(45deg);
`;
