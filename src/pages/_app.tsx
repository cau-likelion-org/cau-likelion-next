
import '@styles/global.css';
import Head from "next/head";
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from "recoil";
import type { AppProps } from 'next/app';
import React from 'react';
import styled from 'styled-components';
import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';

function CauLikeLionNext({ Component, pageProps }: AppProps) {

  const queryClient = new QueryClient();


  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>LikeLionCAU</title>
        </Head>
        <NavBar />
        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
        <Footer />
      </QueryClientProvider>
    </RecoilRoot >
  );
}

export default CauLikeLionNext;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 270px);
  max-width: 100vw;
  width: 100%;
  overflow-y: scroll;

  @media(max-width: 1440px) {
    padding: 100px 250px 100px 250px;
  }
  @media(max-width: 1280px) {
    padding: 100px 150px 100px 150px;
  }
  padding: 100px 360px 100px 360px;
`;