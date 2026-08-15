import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { MessagePayload, getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

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

const getFirebaseApp = (): FirebaseApp =>
  getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG as Required<typeof FIREBASE_CONFIG>);

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

// 알림 권한을 요청하고 이 기기의 FCM 토큰을 발급받는다.
// 권한이 거부됐거나 지원하지 않는 환경이면 null.
export const requestFcmToken = async (): Promise<string | null> => {
  if (!isPushSupported() || !(await isSupported())) return null;
  if (!VAPID_KEY) {
    console.warn('[push] NEXT_PUBLIC_FIREBASE_VAPID_KEY가 없어 토큰을 발급할 수 없습니다.');
    return null;
  }

  const registration = await registerMessagingServiceWorker();
  if (!registration) return null;

  // 브라우저가 사용자 제스처 없이 호출하면 무시하거나 영구 차단하므로 반드시 클릭 등에서 호출할 것
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  try {
    const token = await getToken(getMessaging(getFirebaseApp()), {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    return token || null;
  } catch (error) {
    console.error('[push] FCM 토큰 발급 실패', error);
    return null;
  }
};

// 앱이 열려 있는 동안에는 서비스 워커의 onBackgroundMessage가 아니라 이쪽으로 들어온다.
// 반환값은 구독 해제 함수.
export const subscribeForegroundMessage = async (handler: (payload: MessagePayload) => void) => {
  if (!isPushSupported() || !(await isSupported())) return undefined;
  if (missingConfigKeys().length > 0) return undefined;
  return onMessage(getMessaging(getFirebaseApp()), handler);
};
