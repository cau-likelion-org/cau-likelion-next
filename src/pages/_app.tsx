import '@styles/global.css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import LayoutDefault from '@common/layout/LayoutDefault';
import { useState, useEffect } from 'react';
import { Router, useRouter } from 'next/router';
import Loading from '@common/loading/Loading';
import ReactGA from 'react-ga4';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-WPZ880EJTD';

if (typeof window !== 'undefined' && GA_ID) {
  ReactGA.initialize(GA_ID);
}

function CauLikeLionNext({ Component, pageProps }: AppPropsWithLayout) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page: ReactElement) => <LayoutDefault>{page}</LayoutDefault>);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: router.asPath });

    const start = () => {
      setLoading(true);
    };

    const end = (url: string) => {
      setLoading(false);
      ReactGA.send({ hitType: 'pageview', page: url });
    };

    const error = () => {
      setLoading(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', error);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', error);
    };
  }, []);

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>LikeLionCAU</title>
        </Head>
        {loading ? (
          <Loading />
        ) : (
          getLayout(
            <Component {...pageProps} />,
          )
        )}
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default CauLikeLionNext;
