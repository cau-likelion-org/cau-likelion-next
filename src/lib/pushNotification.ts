import type { MessagePayload } from 'firebase/messaging';

import LocalStorage from '@utils/localStorage';

// FCM 웹 푸시 설정.
// 서비스 워커는 번들러를 안 거쳐서 환경변수를 직접 못 읽으므로 쿼리스트링으로 넘긴다.
// (dev/prod Firebase 프로젝트가 달라도 파일 수정 없이 동작)

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

const missingConfigKeys = () =>
  Object.entries(FIREBASE_CONFIG)
    .filter(([, value]) => !value)
    .map(([key]) => key);

export const isPushSupported = () =>
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

// iOS는 홈 화면에 추가한 PWA 안에서만 웹 푸시가 동작한다 (iOS 16.4+)
export const isIosBrowserWithoutPush = () => {
  if (typeof window === 'undefined') return false;
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  return isIos && !isStandalone && !isPushSupported();
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' =>
  isPushSupported() ? Notification.permission : 'unsupported';

// firebase SDK를 정적으로 import하면 firebase/app + firebase/messaging + idb가
// 전 페이지 공통 청크에 들어가 첫 화면 렌더를 막는다.
// 알림 기능을 실제로 건드리는 시점에만 내려받는다.
type MessagingModule = typeof import('firebase/messaging');

const loadMessaging = () => import('firebase/messaging');

const getMessagingInstance = async (messaging: MessagingModule) => {
  const { getApp, getApps, initializeApp } = await import('firebase/app');
  const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG as Required<typeof FIREBASE_CONFIG>);
  return messaging.getMessaging(app);
};

export const registerMessagingServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isPushSupported()) return null;

  const missingKeys = missingConfigKeys();
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

// 로그아웃할 때 이 기기 토큰만 골라 삭제해야 하는데, 그 시점엔 토큰을 다시 발급받을 수 없어서 캐시해둔다
const FCM_TOKEN_KEY = 'fcmToken';

export const getCachedFcmToken = () => LocalStorage.getItem(FCM_TOKEN_KEY);
export const clearCachedFcmToken = () => LocalStorage.removeItem(FCM_TOKEN_KEY);

const issueToken = async (): Promise<string | null> => {
  if (!VAPID_KEY) {
    console.warn('[push] NEXT_PUBLIC_FIREBASE_VAPID_KEY가 없어 토큰을 발급할 수 없습니다.');
    return null;
  }

  const registration = await registerMessagingServiceWorker();
  if (!registration) return null;

  try {
    const messaging = await loadMessaging();
    const token = await messaging.getToken(await getMessagingInstance(messaging), {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    if (token) LocalStorage.setItem(FCM_TOKEN_KEY, token);
    return token || null;
  } catch (error) {
    console.error('[push] FCM 토큰 발급 실패', error);
    return null;
  }
};

// 알림 권한을 요청하고 이 기기의 FCM 토큰을 발급받는다.
// 브라우저가 사용자 제스처 없이 호출하면 무시하거나 영구 차단하므로 반드시 클릭에서 호출할 것.
export const requestFcmToken = async (): Promise<string | null> => {
  if (!isPushSupported()) return null;

  // firebase 청크를 먼저 내려받으면 그 사이 사용자 제스처가 만료돼
  // 모바일 브라우저가 팝업 없이 바로 거부해버리기 때문에 권한 요청을 항상 제일 먼저 한다.
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  if (!(await (await loadMessaging()).isSupported())) return null;

  return issueToken();
};

// 이미 허용한 기기에서만 조용히 토큰을 갱신한다 (권한 팝업을 띄우지 않음).
// FCM 토큰은 브라우저가 주기적으로 재발급하므로 접속할 때마다 갱신해야 알림이 끊기지 않는다.
export const refreshFcmTokenIfGranted = async (): Promise<string | null> => {
  if (!isPushSupported() || Notification.permission !== 'granted') return null;
  if (!(await (await loadMessaging()).isSupported())) return null;

  return issueToken();
};

// 앱이 열려 있는 동안에는 서비스 워커의 onBackgroundMessage가 아니라 이쪽으로 들어오고,
// 이 경우 브라우저가 알림을 자동으로 띄워주지 않으므로 직접 띄운다.
// 반환값은 구독 해제 함수.
export const subscribeForegroundNotification = async (): Promise<(() => void) | undefined> => {
  // 설정값 확인을 firebase 로드보다 먼저 해서, 환경변수가 없으면 SDK를 아예 받지 않는다
  if (!isPushSupported() || missingConfigKeys().length > 0) return undefined;

  const messaging = await loadMessaging();
  if (!(await messaging.isSupported())) return undefined;

  return messaging.onMessage(await getMessagingInstance(messaging), async (payload: MessagePayload) => {
    const title = payload.notification?.title;
    if (!title) return;

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return;

    registration.showNotification(title, {
      body: payload.notification?.body,
      icon: '/favicon-192x192.png',
      badge: '/favicon-96x96.png',
      data: payload.data,
    });
  });
};
