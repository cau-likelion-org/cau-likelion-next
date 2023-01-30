import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import styled from 'styled-components';

const ScrollBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <ScrollBarComponent
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      style={{
        scaleX,
      }}
    ></ScrollBarComponent>
  );
};
const ScrollBarComponent = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: black;
  transform-origin: 0%;
  z-index: 999;
`;

export default ScrollBar;
