import FadeInComponent from '@home/common/FadeInComponent';
import { Variants } from 'framer-motion';
import styled from 'styled-components';
import PlanBox from './component/PlanBox';

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
    <FadeInComponent variants={fadeInAnimation}>
      <Wrapper>
        <AlignWrapper>
          <TitleText>연간 일정</TitleText>
          <PlanBox />
        </AlignWrapper>
      </Wrapper>
    </FadeInComponent>
  );
};

export default PlanSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 40px;
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
  text-align: center;
  margin: 15px 0;
  @media (max-width: 900px) {
    font-size: 2rem;
  }
`;
