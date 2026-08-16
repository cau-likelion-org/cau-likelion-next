type AmplitudeSdk = typeof import('@amplitude/analytics-browser');

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || 'c4252d34333133a2b9d68bba8e33265b';

// SDK를 정적으로 import하면 이 모듈을 쓰는 모든 화면의 첫 로딩에 포함된다.
// 실제로 이벤트를 보내는 시점에 한 번만 내려받고, 그 전에 들어온 호출은
// 같은 Promise에 체이닝되므로 호출 순서 그대로 실행된다.
let sdkPromise: Promise<AmplitudeSdk> | null = null;

const loadSdk = (): Promise<AmplitudeSdk> | null => {
  if (typeof window === 'undefined' || !AMPLITUDE_API_KEY) return null;
  if (!sdkPromise) {
    sdkPromise = import('@amplitude/analytics-browser').then((sdk) => {
      sdk.init(AMPLITUDE_API_KEY, { defaultTracking: false, minIdLength: 1 });
      return sdk;
    });
  }
  return sdkPromise;
};

export const track = (eventName: string, properties?: Record<string, unknown>) => {
  void loadSdk()?.then((sdk) => sdk.track(eventName, properties));
};

// 주의: SDK가 아직 로드되지 않은 상태에서 페이지를 떠나면 전송되지 않는다.
// (현재 호출하는 곳이 없어 동작에 영향은 없음)
export const trackBeforeUnload = (eventName: string, properties?: Record<string, unknown>) => {
  void loadSdk()?.then((sdk) => {
    sdk.setTransport('beacon');
    sdk.track(eventName, properties);
  });
};

export const setUserId = (userId?: string) => {
  void loadSdk()?.then((sdk) => sdk.setUserId(userId));
};

export const getDeviceType = (): 'mobile' | 'pc' => {
  if (typeof window === 'undefined') return 'pc';
  return window.innerWidth < 900 ? 'mobile' : 'pc';
};

let pageEntryTime = typeof window !== 'undefined' ? Date.now() : 0;

export const markPageEntry = () => {
  pageEntryTime = Date.now();
};

export const getPageEntryTime = () => pageEntryTime;

export const getUserIdFromToken = (accessToken?: string): string | undefined => {
  if (!accessToken) return undefined;
  try {
    const payload = accessToken.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.user_id;
  } catch {
    return undefined;
  }
};
