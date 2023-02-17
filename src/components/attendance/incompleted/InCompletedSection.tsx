import styled from 'styled-components';

import { Primary } from '@utils/constant/color';

import AttendanceBox from './component/AttendanceBox';

const IncompletedSection = () => {
  return (
    <CircleWrapper>
      <Circle />
      <Circle2 />
      <Circle />
      <AttendanceBox />
    </CircleWrapper>
  );
};

export default IncompletedSection;

const CircleWrapper = styled.div`
  position: relative;
  width: 640px;
  height: 640px;
  @media (max-width: 900px) {
    width: 350px;
    height: 350px;
  }
`;
const Circle = styled.div`
  position: absolute;
  border-color: ${Primary.default};
  border-style: solid;
  width: 640px;
  height: 640px;
  border-radius: 100%;
  border-width: 2px;
  @media (max-width: 900px) {
    width: 350px;
    height: 350px;
  }
`;

const Circle2 = styled(Circle)`
  top: 2%;
  left: 2%;
  background-color: white;
`;
