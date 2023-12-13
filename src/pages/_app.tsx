import '@styles/global.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import LayoutDefault from '@common/layout/LayoutDefault';
import { useState, useEffect } from 'react';
import { Router } from 'next/router';
import Loading from '@common/loading/Loading';
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
function CauLikeLionNext({ Component, pageProps }: AppPropsWithLayout) {
  const [loading, setLoading] = useState(false);
  const queryClient = new QueryClient();
  const getLayout = Component.getLayout || ((page: ReactElement) => <LayoutDefault>{page}</LayoutDefault>);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.on('routeChangeStart', start);
      Router.events.on('routeChangeComplete', end);
      Router.events.on('routeChangeError', end);
    };
  }, []);
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>LikeLionCAU</title>
        </Head>
        {loading ? <Loading /> : getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default CauLikeLionNext;
