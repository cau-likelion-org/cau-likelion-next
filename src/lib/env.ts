// 앱에서 쓰는 공개 환경변수(NEXT_PUBLIC_*)는 이 파일을 통해서만 읽는다.
// 나머지 코드는 process.env를 직접 참조하지 않는다.
//
// SENTRY_DSN(서버 전용, NEXT_PUBLIC_ 접두어 없음)은 여기 포함하지 않는다 —
// 이 파일은 클라이언트 번들에도 포함되는데, non-public 변수는 브라우저 번들에서
// 인라인되지 않고 `process`도 없어 참조하는 순간 런타임 에러가 난다.
// 그래서 instrumentation.ts(Node 런타임 전용)에서만 process.env.SENTRY_DSN을 직접 읽는다.

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_KEY,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sentryEnv: process.env.NEXT_PUBLIC_SENTRY_ENV,
  sentryRelease: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  amplitudeApiKey: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  },
} as const;
