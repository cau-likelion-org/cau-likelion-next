import '@styles/global.css';
import 'swiper/css';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import LayoutDefault from '@common/layout/LayoutDefault';
import { useState, useEffect, useRef } from 'react';
import { Router, useRouter } from 'next/router';
import Loading from '@common/loading/Loading';
import ReactGA from 'react-ga4';
import useTokenStore from 'src/store/useTokenStore';
import { track, markPageEntry, setUserId, getUserIdFromToken } from 'src/lib/amplitude';
import { registerMessagingServiceWorker } from 'src/lib/pushNotification';

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

function AppContent({ Component, pageProps }: AppPropsWithLayout) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  const tokenState = useTokenStore((state) => state.token);
  const hydrate = useTokenStore((state) => state.hydrate);
  const previousPathRef = useRef<string | undefined>(undefined);
  const getLayout = Component.getLayout || ((page: ReactElement) => <LayoutDefault>{page}</LayoutDefault>);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setUserId(getUserIdFromToken(tokenState.access ?? undefined));
  }, [tokenState.access]);

  // 서비스 워커만 미리 등록해 둔다 (알림 권한 요청은 사용자가 직접 켤 때)
  useEffect(() => {
    registerMessagingServiceWorker();
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: router.asPath });
    markPageEntry();
    track('Page Viewed', {
      page_path: router.asPath,
      referrer_path: typeof document !== 'undefined' ? document.referrer : undefined,
      is_logged_in: !!tokenState.access,
    });
    previousPathRef.current = router.asPath;

    const start = () => {
      setLoading(true);
    };

    const end = (url: string) => {
      setLoading(false);
      ReactGA.send({ hitType: 'pageview', page: url });
      markPageEntry();
      track('Page Viewed', {
        page_path: url,
        referrer_path: previousPathRef.current,
        is_logged_in: !!tokenState.access,
      });
      previousPathRef.current = url;
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
  }, [tokenState.access]);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>LikeLionCAU</title>
      </Head>
      {loading ? <Loading /> : getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>
  );
}

function CauLikeLionNext(props: AppPropsWithLayout) {
  return <AppContent {...props} />;
}

export default CauLikeLionNext;
