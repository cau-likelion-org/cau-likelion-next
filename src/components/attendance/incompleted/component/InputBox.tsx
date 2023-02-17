import styled from 'styled-components';

import { Primary, GreyScale } from '@utils/constant/color';

const InputBox = ({ title, detail }: { title: string; detail: string }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Input>{detail}</Input>
    </Wrapper>
  );
};

export default InputBox;
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 1.7rem;
  margin-right: 3rem;
  word-spacing: 25px;
<<<<<<< HEAD
  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
const Input = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25rem;
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 1.7rem;
  height: 6rem;
  background-color: ${Primary.light};
  border-radius: 15px;
  color: ${GreyScale.default};
<<<<<<< HEAD
  @media (max-width: 900px) {
    font-size: 1.5rem;
    height: 5rem;
    width: 15rem;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
`;
