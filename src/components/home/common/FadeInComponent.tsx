import { useAnimation, useInView, motion, Variants } from 'framer-motion';
import { ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';

const defaultFadeInAnimation: Variants = {
  visible: {
    opacity: 1,
    transition: { duration: 1 },
  },
  hidden: {
    opacity: 0,
  },
};

const FadeInComponent = ({ children, variants }: { children: ReactElement; variants?: Variants }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, isInView]);

  return (
    <Wrapper>
      <Absolute ref={ref} animate={controls} initial="hidden" variants={variants ? variants : defaultFadeInAnimation}>
        {children}
      </Absolute>
    </Wrapper>
  );
};
const Absolute = styled(motion.div)`
  width: 100%;
  @media (min-width: 900px) {
    position: absolute;
  }
`;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  @media (min-width: 900px) {
    scroll-snap-align: start;
    height: 100%;
    min-height: 100vh;
  }
`;
export default FadeInComponent;
