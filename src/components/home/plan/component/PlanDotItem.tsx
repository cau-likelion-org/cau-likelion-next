import styled from 'styled-components';

import { Primary } from '@utils/constant/color';

const PlanDotItem = () => {
  return (
    <>
      <BlueLine />
      {Array.from({ length: 5 }, (item, index) => (
        <Circle key={index} />
      ))}
    </>
  );
};

export default PlanDotItem;

const Circle = styled.div`
  width: 28px;
  height: 28px;
  background-color: ${Primary.default};
  border-radius: 100%;
  position: relative;
  background: #1a21bd;
  box-shadow: 0px 0px 15px #1b00fd;
  z-index: -1;
  @media(max-width:900px){
    width: 18px;
    height: 18px;
  }
`;

const BlueLine = styled.hr`
  position: absolute;
  width: 100%;
  height: 1px;
  border: 0px;
  border-top: 2px solid ${Primary.default};

  z-index: 0;
`;

const BigCircle = styled(Circle)`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 52px;
  height: 52px;
  background-color: #d3ceff;

  z-index: 0;
`;
