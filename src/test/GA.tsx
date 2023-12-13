'use client';

import Script from 'next/script';
import * as gtag from '../lib/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const GA_KEY = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

const GA = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_KEY}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_KEY}', {
          page_path: window.location.pathname,
        });
      `,
        }}
      />
    </>
  );
};

export default GA;
