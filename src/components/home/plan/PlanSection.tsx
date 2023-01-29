import React from 'react';
import styled from 'styled-components';
import PlanBox from './component/PlanBox';

const PlanSection = () => {
  return (
    <Wrapper>
      <TitleText>연간 일정</TitleText>
      <PlanBox />
    </Wrapper>
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

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 3.7rem;
  line-height: 76.51px;
  text-align: center;
  margin: 15px 0;
`;