type SentryModule = typeof import('@sentry/nextjs');
type BufferedError = { value: unknown; tags?: Record<string, string> };

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Sentry SDK는 gzip 28kB로, 정적으로 붙이면 모든 라우트의 첫 렌더를 그만큼 늦춘다.
// SDK는 유휴 시점에 내려받고, 그 전에 발생한 에러는 버퍼에 쌓았다가 초기화 직후 흘려보낸다.
const buffered: BufferedError[] = [];
let sdkPromise: Promise<SentryModule | null> | null = null;
let ready = false;

export const isReporterReady = () => ready;

export const loadReporter = (): Promise<SentryModule | null> => {
  if (typeof window === 'undefined' || !DSN) return Promise.resolve(null);

  if (!sdkPromise) {
    sdkPromise = import('@sentry/nextjs')
      .then((Sentry) => {
        Sentry.init({
          dsn: DSN,
          environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'production',
          release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
          // 성능 추적·세션 리플레이는 켜지 않는다.
          // 지금 필요한 건 "에러가 났는지 아는 것"이고, 둘 다 번들만 크게 키운다.
          tracesSampleRate: 0,
          sendDefaultPii: false,
        });

        ready = true;
        for (const item of buffered) {
          Sentry.captureException(item.value, item.tags ? { tags: item.tags } : undefined);
        }
        buffered.length = 0;
        return Sentry;
      })
      .catch(() => {
        // SDK를 못 받아도 앱 동작에는 영향이 없어야 한다
        return null;
      });
  }

  return sdkPromise;
};

// SDK 로드 여부와 관계없이 호출할 수 있다. 아직이면 버퍼에 쌓고, 로드를 앞당긴다.
export const captureError = (value: unknown, tags?: Record<string, string>) => {
  if (typeof window === 'undefined' || !DSN) return;

  if (ready) {
    void loadReporter().then((Sentry) => Sentry?.captureException(value, tags ? { tags } : undefined));
    return;
  }

  buffered.push({ value, tags });
  void loadReporter();
};
