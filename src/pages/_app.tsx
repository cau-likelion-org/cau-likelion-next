import '@styles/global.css';
import 'pretendard/dist/web/static/pretendard-subset.css';
import 'swiper/css';
import Head from 'next/head';
import { QueryCache, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
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
import { track, identifyUser, resetUser } from 'src/lib/amplitude';
import { getUserProfile } from 'src/apis/account';
import { UserProfile } from '@@types/request';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// useQuery는 QueryClientProvider의 자손에서만 컨텍스트를 읽을 수 있어, Provider를 직접 렌더링하는
// AppContent 안이 아니라 그 자식으로 따로 둔다
function AmplitudeIdentitySync() {
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const tokenAccess = useTokenStore((state) => state.token.access);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(useTokenStore.getState().token),
    enabled: !!tokenAccess,
  });

  useEffect(() => {
    if (userProfile) identifyUser(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (hasHydrated && !tokenAccess) resetUser();
  }, [hasHydrated, tokenAccess]);

  return null;
}

function AppContent({ Component, pageProps }: AppPropsWithLayout) {
  // 프로필 조회가 인증 문제로 실패하면 화면들이 아무것도 렌더링하지 않으므로(빈 화면),
  // 세션을 정리하고 로그인으로 보낸다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
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

  // Amplitude Page Viewed: 첫 로드 + 이후 모든 라우트 이동.
  // 첫 로드는 사이트 내부 이전 경로가 없으니, 외부에서 왔다면 그 도메인(document.referrer)을 대신 담는다.
  useEffect(() => {
    let previousPath = document.referrer;
    const trackPageViewed = (path: string) => {
      track('Page Viewed', {
        page_path: path,
        referrer_path: previousPath,
        is_logged_in: !!useTokenStore.getState().token.access,
      });
      previousPath = path;
    };

    trackPageViewed(NextRouter.asPath);
    const handleRouteChangeComplete = (url: string) => trackPageViewed(url);

    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    return () => Router.events.off('routeChangeComplete', handleRouteChangeComplete);
  }, []);

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

  // iOS Safari는 scroll-snap-type이 켜진 채로 SPA 네비게이션하면 스크롤 리셋을 스냅 위치로 되받아친다
  useEffect(() => {
    const html = document.documentElement;
    const disableSnap = (_url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;
      html.style.scrollSnapType = 'none';
    };
    const restoreSnap = (_url: string, { shallow }: { shallow: boolean }) => {
      if (shallow) return;
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        html.style.scrollSnapType = '';
      });
    };

    Router.events.on('routeChangeStart', disableSnap);
    Router.events.on('routeChangeComplete', restoreSnap);
    Router.events.on('routeChangeError', restoreSnap);

    return () => {
      Router.events.off('routeChangeStart', disableSnap);
      Router.events.off('routeChangeComplete', restoreSnap);
      Router.events.off('routeChangeError', restoreSnap);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AmplitudeIdentitySync />
      <Head>
        <title>LikeLionCAU</title>
      </Head>
      <div>
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
      </div>
    </QueryClientProvider>
  );
}

function CauLikeLionNext(props: AppPropsWithLayout) {
  return <AppContent {...props} />;
}

export default CauLikeLionNext;
