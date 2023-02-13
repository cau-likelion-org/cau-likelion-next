import { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterval } from 'src/hooks/useInterval';

const animateVariant = {
  initial: {
    x: 1000,
  },
  animate: {
    x: 0,
    transition: {
      type: 'Tween',
      duration: 1,
    },
  },
  exit: {
    x: -1000,
    transition: {
      type: 'Tween',
      duration: 1,
    },
  },
};

const Carousel = ({ images }: { images: string[]; }) => {
  const [index, setIndex] = useState(0);
  useInterval(() => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)), 3000);

  return (
    <Wrapper>
      <CarouselWrapper>
        <AnimatePresence initial={false}>
          <ImageWrapper key={index} variants={animateVariant} initial="initial" animate="animate" exit="exit">
            <Image src={images[index]} alt="img" layout="fill" objectFit="cover" objectPosition="center" />
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
