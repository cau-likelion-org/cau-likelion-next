import React, { ReactElement } from 'react';
import styled from 'styled-components';

import LayoutLogin from '@common/layout/LayoutLogin';
import ContentsSection from 'src/components/login/contents/ContentsSection';
import BorderSection from 'src/components/login/border/BorderSection';
import LayoutArchiving from '@common/layout/LayoutArchiving';

const Login = () => {
  return (
    <StWrapper>
      <StContentsWrapper>
        <ContentsSection />
      </StContentsWrapper>
      <StBorderWrapper>
        <BorderSection />
      </StBorderWrapper>
    </StWrapper>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default Login;

const StWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100rem;
  height: 80vh;

  @media (max-width: 1440px) {
    padding: 0px 250px 0px 250px;
  }
  @media (max-width: 1280px) {
    padding: 0px 150px 0px 150px;
  }
  padding: 0px 360px 0px 360px;
  @media (max-width: 1200px) {
    padding: 0px;
    width: 100%;
    height: 100%;
  }
`;

const StContentsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100rem;
  padding-top: 10rem;
  width: 100rem;
  
  @media (max-width: 1200px) {
    width: 100%;
    padding: 0;
  }
`;

const StBorderWrapper = styled.div`
  position: absolute;
  width: 100rem;
  height: 100rem;
  padding-top: 10rem;
  @media (max-width: 1200px) {
    display: none;
  }

`;
