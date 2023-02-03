import '@styles/global.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import LayoutDefault from '@common/layout/LayoutDefault';
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
function CauLikeLionNext({ Component, pageProps }: AppPropsWithLayout) {
  const queryClient = new QueryClient();
  const getLayout =
    Component.getLayout ||
    ((page: ReactElement) => <LayoutDefault>{page}</LayoutDefault>);
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>LikeLionCAU</title>
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default CauLikeLionNext;
