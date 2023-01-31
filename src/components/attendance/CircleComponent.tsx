import React from 'react';
import styled from 'styled-components';
import { Primary } from '@utils/constant/color';
import AttendanceBox from './AttendanceBox';

const CircleComponent = () => {
  return (
    <CircleWrapper>
      <Circle />
      <Circle2 />
      <Circle />
      <AttendanceBox />
    </CircleWrapper>
  );
};

export default CircleComponent;

const CircleWrapper = styled.div`
  position: relative;
  width: 640px;
  height: 640px;
`;
const Circle = styled.div`
  position: absolute;
  border-color: ${Primary.default};
  border-style: solid;
  width: 640px;
  height: 640px;
  border-radius: 100%;
  border-width: 2px;
`;

const Circle2 = styled(Circle)`
  top: 2%;
  left: 2%;
  background-color: white;
`;
