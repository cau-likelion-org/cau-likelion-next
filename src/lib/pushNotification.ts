// FCM 서비스 워커 등록.
// 서비스 워커는 번들러를 안 거쳐서 환경변수를 직접 못 읽으므로 쿼리스트링으로 넘긴다.
// (dev/prod Firebase 프로젝트가 달라도 파일 수정 없이 동작)

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isPushSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

export const registerMessagingServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isPushSupported()) return null;

  const missingKeys = Object.entries(FIREBASE_CONFIG)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missingKeys.length > 0) {
    console.warn(`[push] Firebase 환경변수가 없어 서비스 워커를 등록하지 않습니다: ${missingKeys.join(', ')}`);
    return null;
  }

  const query = new URLSearchParams(FIREBASE_CONFIG as Record<string, string>).toString();
  try {
    return await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${query}`);
  } catch (error) {
    console.error('[push] 서비스 워커 등록 실패', error);
    return null;
  }
};
