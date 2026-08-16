import '@styles/global.css';
import 'swiper/css';
import Head from 'next/head';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import LayoutDefault from '@common/layout/LayoutDefault';
import RecruitModalRoot from '@home/main/RecruitModalRoot';
import { useState, useEffect, useRef } from 'react';
import NextRouter, { Router, useRouter } from 'next/router';
import Loading from '@common/loading/Loading';
import ReactGA from 'react-ga4';
import useTokenStore from 'src/store/useTokenStore';
import { track, markPageEntry, setUserId, getUserIdFromToken } from 'src/lib/amplitude';
import {
  refreshFcmTokenIfGranted,
  registerMessagingServiceWorker,
  subscribeForegroundNotification,
} from 'src/lib/pushNotification';
import { updateFcmToken } from 'src/apis/account';

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
  // 프로필 조회가 인증 문제로 실패하면 화면들이 아무것도 렌더링하지 않으므로(빈 화면),
  // 세션을 정리하고 로그인으로 보낸다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.queryKey[0] !== 'userProfile') return;
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            if (status !== 401 && status !== 403) return;
            useTokenStore.getState().setToken({ access: null, refresh: null });
            if (NextRouter.pathname !== '/login') NextRouter.replace('/login');
          },
        }),
      }),
  );
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

  // 앱이 열려 있을 땐 브라우저가 알림을 자동 표시하지 않아 직접 띄워야 한다
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    subscribeForegroundNotification().then((fn) => {
      unsubscribe = fn;
    });
    return () => unsubscribe?.();
  }, []);

  // FCM 토큰은 브라우저가 주기적으로 재발급하므로, 이미 알림을 켠 기기는 로그인할 때마다 갱신해준다
  useEffect(() => {
    if (!tokenState.access) return;
    refreshFcmTokenIfGranted().then((fcmToken) => {
      if (fcmToken) updateFcmToken(tokenState, fcmToken).catch(() => undefined);
    });
  }, [tokenState]);

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
      <RecruitModalRoot />
    </QueryClientProvider>
  );
}

function CauLikeLionNext(props: AppPropsWithLayout) {
  return <AppContent {...props} />;
}

export default CauLikeLionNext;
