import FadeInComponent from '@home/common/FadeInComponent';
import { Variants } from 'framer-motion';
import styled from 'styled-components';

<<<<<<< HEAD
=======
import PlanBox from './component/PlanBox';
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
const fadeInAnimation: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
  hidden: {
    opacity: 0,
    y: -100,
  },
};
const PlanSection = () => {
  return (
<<<<<<< HEAD
    <FadeInComponent variants={fadeInAnimation}>
      <Wrapper>
=======
    <Wrapper>
      <FadeInComponent variants={fadeInAnimation}>
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
        <AlignWrapper>
          <TitleText>연간 일정</TitleText>
          <PlanBox />
        </AlignWrapper>
<<<<<<< HEAD
      </Wrapper>
    </FadeInComponent>
=======
      </FadeInComponent>
    </Wrapper>
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  );
};

export default PlanSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 40px;
  height: 100%;
  min-height: 100vh;
  scroll-snap-align: start;
`;
const AlignWrapper = styled.div`
  margin-top: 10%;
`;
const AlignWrapper = styled.div`
  width: 100%;
  margin-top: 10%;
`;

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 3.7rem;
<<<<<<< HEAD
  text-align: center;
  margin: 15px 0;
  @media (max-width: 900px) {
    font-size: 2rem;
  }
=======
  line-height: 76.51px;
  text-align: center;
  margin: 15px 0;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
