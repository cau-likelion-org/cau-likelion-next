import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import styled from 'styled-components';

import progressBar from '@image/프로그레스바.png';
import progress from '@image/프로그레스바이동.png';

const ScrollBar = () => {
  const { scrollYProgress } = useScroll(); //스크롤 percent로 표기

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  }); //스크롤 튕기는 애니메이션 효과

  const x = useTransform(scaleX, [0, 1], ['-94%', '0%']); //전체 화면 너비 비율 -94% ~ 0%를 이동

  return (
    <Wrapper>
      <ScrollBarComponent initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ x }}>
        <ScrollBarCurrent />
      </ScrollBarComponent>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  @media(max-width: 900px) {
    display: none;
  };
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: url(${progressBar.src}),
    linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  z-index: 999;
`; //스크롤바 이미지
const ScrollBarComponent = styled(motion.div)`
  width: 100%;
`; //투명 스크롤바(실제로 움직이는 부분)
const ScrollBarCurrent = styled(motion.div)`
  background: url(${progress.src});
  width: 58px;
  height: 29px;
  position: absolute;
  bottom: -2px;
  left: 96%;
`; // 스크롤바 아이콘
export default ScrollBar;
