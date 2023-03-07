import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { useInterval } from 'src/hooks/useInterval';
import useSlider from 'src/hooks/useSlider';

const Carousel = ({ images }: { images: string[]; }) => {
  // const testImages = ['https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-1.png', 'https://cau-likelion.s3.ap-northeast-2.amazonaws.com/project-img/9%E1%84%80%E1%85%B5/Rectangle_336-1.png'];
  // const [index, direction, increase, decrease, animateVariant] = useSlider<string>(testImages, 0.1, 1000, false, 'tween');
  const [index, direction, increase, decrease, animateVariant] = useSlider<string>(images, 0.1, 1000, false, 'tween');
  const [timerBool, setTimerBool] = useState(true);
  const [dragStartX, setdragStartX] = useState(0);
  useInterval(increase, 3000, timerBool);

  const handleScroll = (_: any, info: PanInfo) => {
    setTimerBool((prev) => (prev = true));
    if (dragStartX > info.point.x) increase();
    else decrease();
  };
  return (
    <Wrapper>
      <CarouselWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <ImageWrapper
            key={index}
            variants={animateVariant}
            initial="initial"
            animate="visible"
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
            {/* <CustomImage src={testImages[index]} alt="img" layout="fill" objectFit="cover" objectPosition="center" /> */}
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
  @media(max-width:900px){
    height:30vh;
  }
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
