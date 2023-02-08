import { GreyScale } from '@utils/constant/color';
import styled from 'styled-components';

const SearchBar = () => {
  return (
    <Wrapper>
      <Input placeholder="검색하기"></Input>
    </Wrapper>
  );
};

export default SearchBar;
const Wrapper = styled.div`
  position: absolute;
`;
const Input = styled.input`
  background-color: ${GreyScale.light};
  width: 188px;
  height: 51px;
  border-radius: 30px;
  border: none;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 17px;
  padding-left: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  &::placeholder {
    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 160%;
    color: ${GreyScale.default};
  }
`;
