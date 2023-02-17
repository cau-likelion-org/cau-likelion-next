import styled from 'styled-components';

import { Primary } from '@utils/constant/color';

<<<<<<< HEAD
const PlanDateItem = ({ date }: { date: string; }) => {
=======
const PlanDateItem = ({ date }: { date: string }) => {
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  return <Date>{date}</Date>;
};

export default PlanDateItem;

const Date = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
<<<<<<< HEAD
  font-size: 1.5rem;
  @media(min-width:900px){
    line-height: 32px;
  }
=======
  font-size: 15px;
  line-height: 32px;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  text-align: center;
  color: ${Primary.default};
  background: #e3e4ff;
  border-radius: 50px;
  padding: 5px 18px;
<<<<<<< HEAD
  @media(max-width: 900px) {
    padding: 2px 5px;
    border-radius: 15px;
    font-size: 1rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
