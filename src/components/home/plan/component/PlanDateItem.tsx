import { Primary } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const PlanDateItem = ({ date }: { date: string }) => {
  return <Date>{date}</Date>;
};

export default PlanDateItem;

const Date = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 32px;
  text-align: center;
  color: ${Primary.default};
  background: #e3e4ff;
  border-radius: 50px;
  padding: 5px 18px;
`;
