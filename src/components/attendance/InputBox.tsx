import styled from 'styled-components';
import { Primary } from '@utils/constant/color';
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
  font-style: normal;
  font-weight: 500;
  font-size: 1.7rem;
  margin-right: 3rem;
  word-spacing: 25px;
`;
const Input = styled.div`
  width: 25rem;
  height: 6rem;
  background-color: ${Primary.light};
  border-radius: 15px;
`;
