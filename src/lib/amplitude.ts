import * as amplitude from '@amplitude/analytics-browser';

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || 'c4252d34333133a2b9d68bba8e33265b';

if (typeof window !== 'undefined' && AMPLITUDE_API_KEY) {
  amplitude.init(AMPLITUDE_API_KEY, { defaultTracking: false });
}

export const track = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !AMPLITUDE_API_KEY) return;
  amplitude.track(eventName, properties);
};

export const trackBeforeUnload = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !AMPLITUDE_API_KEY) return;
  amplitude.setTransport('beacon');
  amplitude.track(eventName, properties);
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
