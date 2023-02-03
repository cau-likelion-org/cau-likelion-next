import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import styled from 'styled-components';
import progressBar from '@image/프로그레스바.png';
import progress from '@image/프로그레스바이동.png';

const ScrollBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const x = useTransform(scaleX, [0, 1], ['-94%', '0%']);
  return (
    <Wrapper>
      <ScrollBarComponent initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ x }}>
        <ScrollBarCurrent />
      </ScrollBarComponent>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: url(${progressBar.src}),
    linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  z-index: 999;
`;
const ScrollBarComponent = styled(motion.div)`
  width: 100%;
`;
const ScrollBarCurrent = styled(motion.div)`
  background: url(${progress.src});
  width: 58px;
  height: 23px;
  position: absolute;
  bottom: -9.5px;
  left: 96%;
`;
export default ScrollBar;
