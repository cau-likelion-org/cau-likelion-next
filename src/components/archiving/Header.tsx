import React from 'react';
import styled from 'styled-components';
import { GreyScale } from '@utils/constant/color';
const Header = ({ pageName, introduce }: { pageName: string; introduce: string; }) => {
  return (
    <Wrapper>
      <Category>아카이빙 &gt; {pageName}</Category>
      <Title>{introduce}</Title>
      <hr />
    </Wrapper>
  );
};

export default Header;
const Category = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 21px;
  @media (max-width: 1550px) {
    font-size: 1.5rem;
  }
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 4rem;
  @media (max-width: 1550px) {
    font-size: 2.3rem;
  }
  margin-top: 10px;
  margin-bottom: 20px;
`;
const Wrapper = styled.div`
  &hr {
    color: ${GreyScale.light};
  }
`;
