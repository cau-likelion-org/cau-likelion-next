import React from 'react';
import PostAdmin from 'src/components/admin/PostAdmin';
import styled from 'styled-components';

const Admin = () => {
  return (
    <Wrapper>
      <Title>관리자 페이지</Title>
      <PostAdmin />
    </Wrapper>
  );
};

export default Admin;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  /* height: 100vh; */
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 900px) {
    height: 100%;
    margin: 90px 0px;
  }
`;

const Title = styled.div`
  font-size: 4rem;
  font-weight: bold;
`;
