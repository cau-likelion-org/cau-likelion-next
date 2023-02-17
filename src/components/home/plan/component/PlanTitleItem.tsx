import styled from 'styled-components';

<<<<<<< HEAD
const PlanTitleItem = ({ title }: { title: string; }) => {
=======
const PlanTitleItem = ({ title }: { title: string }) => {
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  return <Title>{title}</Title>;
};

export default PlanTitleItem;

const Title = styled.div`
  color: black;
  font-size: 1.7rem;
<<<<<<< HEAD
=======
  line-height: 40px;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  font-weight: 500;
  white-space: pre;
  font-family: 'Pretendard';
  font-style: normal;
<<<<<<< HEAD
  text-align: center;
  @media(min-width:900px){
    line-height: 30px;
  }
  @media(max-width:900px){
    font-size: 1rem;
  }
=======
  line-height: 160%;
  text-align: center;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
