import '@styles/global.css';
import 'swiper/css';
import Head from 'next/head';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import LayoutDefault from '@common/layout/LayoutDefault';
import Loading from '@common/loading/Loading';
import RecruitModalRoot from '@home/main/RecruitModalRoot';
import { useState, useEffect } from 'react';
import NextRouter, { Router } from 'next/router';
import ErrorBoundary from '@common/errorBoundary/ErrorBoundary';
import useTokenStore from 'src/store/useTokenStore';
import { registerMessagingServiceWorker, subscribeForegroundNotification } from 'src/lib/pushNotification';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function AppContent({ Component, pageProps }: AppPropsWithLayout) {
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
  const hydrate = useTokenStore((state) => state.hydrate);
  const getLayout = Component.getLayout || ((page: ReactElement) => <LayoutDefault>{page}</LayoutDefault>);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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

  const [isRouting, setIsRouting] = useState(false);
  useEffect(() => {
    const start = (url: string) => {
      const isInsideMyPage = NextRouter.asPath.startsWith('/mypage') && url.startsWith('/mypage');
      const isProjectListRoute = (path: string) => /^\/project(\/\d+)?(\?|#|$)/.test(path);
      const isInsideProjectList = isProjectListRoute(NextRouter.asPath) && isProjectListRoute(url);
      setIsRouting(!isInsideMyPage && !isInsideProjectList);
    };
    const stop = () => setIsRouting(false);

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', stop);
    Router.events.on('routeChangeError', stop);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', stop);
      Router.events.off('routeChangeError', stop);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>LikeLionCAU</title>
      </Head>
      {/* 레이아웃 안쪽을 감싸서, 페이지가 죽어도 네비게이션으로 빠져나갈 수 있게 한다 */}
      {isRouting ? (
        <Loading />
      ) : (
        getLayout(
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>,
        )
      )}
      <RecruitModalRoot />
    </QueryClientProvider>
  );
}

function CauLikeLionNext(props: AppPropsWithLayout) {
  return <AppContent {...props} />;
}

export default CauLikeLionNext;
