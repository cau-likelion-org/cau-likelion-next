import * as Sentry from '@sentry/nextjs';

import { env } from 'src/lib/env';

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // SENTRY_DSN(서버 전용)은 env.ts에 없다 — Node 런타임에서만 직접 읽는다.
  const dsn = process.env.SENTRY_DSN || env.sentryDsn;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: env.sentryEnv || 'production',
    release: env.sentryRelease,
    tracesSampleRate: 0,
    sendDefaultPii: false,
  });
}

// getServerSideProps·getStaticProps·API 라우트에서 터진 에러를 Sentry로 넘긴다
export const onRequestError = Sentry.captureRequestError;
