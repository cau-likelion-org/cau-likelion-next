import styled from 'styled-components';

import { Primary } from '@utils/constant/color';

const PlanDateItem = ({ date }: { date: string; }) => {
  return <Date>{date}</Date>;
};

export default PlanDateItem;

const Date = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 1.5rem;
  @media(min-width:900px){
    line-height: 32px;
  }
  text-align: center;
  color: ${Primary.default};
  background: #e3e4ff;
  border-radius: 50px;
  padding: 5px 18px;
  @media(max-width: 900px) {
    padding: 2px 5px;
    border-radius: 15px;
    font-size: 1rem;
  }
`;
