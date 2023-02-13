import styled from 'styled-components';
import SearchBar from './component/SearchBar';
import searchIcon from '@image/searchIcon.png';
import Image from 'next/image';
import { Primary } from '@utils/constant/color';
const SearchSection = () => {
  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBar />
        <ImageWrapper>
          <Image src={searchIcon} layout="fill" objectFit="fill" objectPosition="center" alt="검색" />
        </ImageWrapper>
      </SearchWrapper>
      <WriteButton>+</WriteButton>
    </Wrapper>
  );
};

export default SearchSection;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 40px;
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 188px;
  height: 51px;
`;
const ImageWrapper = styled.div`
  position: absolute;
  width: 28px;
  height: 28px;
  right: 10px;
  top: 10px;
`;
const WriteButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 30px;
  color: white;
  background-color: ${Primary.default};
  margin-left: 27px;
`;
