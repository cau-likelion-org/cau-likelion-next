import { env } from 'src/lib/env';
import { UserProfile } from '@@types/request';
import { isAdminRole } from '@utils/index';
import { AmplitudeEventName, AmplitudeEventProperties } from 'src/lib/amplitudeEvents';

type AmplitudeModule = typeof import('@amplitude/analytics-browser');
type BufferedEvent = { eventName: AmplitudeEventName; eventProperties: Record<string, unknown> };

const API_KEY = env.amplitudeApiKey;
// 로컬 개발 트래픽이 실제 프로덕션 Amplitude 프로젝트 데이터에 섞이지 않도록 dev 모드에서는 아예 껴둔다.
// (Vercel Preview 배포는 next build로 NODE_ENV=production이라 걸러지지 않는다 — 필요해지면 별도 처리)
const IS_DEV = process.env.NODE_ENV === 'development';
let hasWarnedDev = false;

// Amplitude SDK도 Sentry와 마찬가지로 정적으로 붙이면 첫 렌더를 늦추므로
// 유휴 시점에 내려받고, 그 전에 발생한 이벤트는 버퍼에 쌓았다가 초기화 직후 흘려보낸다.
const buffered: BufferedEvent[] = [];
let sdkPromise: Promise<AmplitudeModule | null> | null = null;
let ready = false;

const loadAmplitude = (): Promise<AmplitudeModule | null> => {
  if (typeof window === 'undefined' || !API_KEY) return Promise.resolve(null);
  if (IS_DEV) {
    if (!hasWarnedDev) {
      hasWarnedDev = true;
      console.warn('[amplitude] 개발 모드에서는 이벤트를 보내지 않습니다 (NODE_ENV=development).');
    }
    return Promise.resolve(null);
  }

  if (!sdkPromise) {
    sdkPromise = import('@amplitude/analytics-browser')
      .then((amplitude) => {
        amplitude.init(API_KEY, {
          // attribution(UTM·리퍼러)·session은 SDK 자동 계측에 맡기고, 페이지뷰는 커스텀 Page Viewed와
          // 중복되므로 끈다. form/file 계측은 이 사이트 성격상 불필요해서 끈다.
          autocapture: {
            attribution: true,
            sessions: true,
            pageViews: false,
            formInteractions: false,
            fileDownloads: false,
          },
        });
        ready = true;
        for (const item of buffered) {
          amplitude.track(item.eventName, item.eventProperties);
        }
        buffered.length = 0;
        return amplitude;
      })
      .catch(() => null);
  }

  return sdkPromise;
};

export const track = <E extends AmplitudeEventName>(eventName: E, eventProperties: AmplitudeEventProperties[E]) => {
  if (typeof window === 'undefined' || !API_KEY || IS_DEV) return;

  if (ready) {
    void loadAmplitude().then((amplitude) => amplitude?.track(eventName, eventProperties));
    return;
  }

  buffered.push({ eventName, eventProperties });
  void loadAmplitude();
};

export const getDeviceType = () => (typeof window !== 'undefined' && window.innerWidth < 900 ? 'mobile' : 'desktop');

// "지원하기" 등 전환 행동을 눌렀는지를 usePageEngagementTracking의 이탈 이벤트에서 판단하기 위한 타임스탬프.
// 페이지별 상태로 따로 두지 않고 마지막 시각만 기억해서, 각 훅이 자기 진입 시각과 비교해 판단한다.
let lastNextActionAt = 0;
export const markNextAction = () => {
  lastNextActionAt = Date.now();
};
export const getLastNextActionAt = () => lastNextActionAt;

// user_id/generation/track/is_admin은 JWT가 아니라 이미 로그인 후 여러 화면에서 불러오는
// UserProfile(GET /api/members/me) 응답을 그대로 재사용한다 (access token엔 exp 외 클레임이 없음)
export const identifyUser = (userProfile: UserProfile) => {
  void loadAmplitude().then((amplitude) => {
    if (!amplitude) return;
    // Amplitude는 user_id/device_id가 5자 미만이면 서버에서 거부한다(Invalid id length) —
    // 회원 id가 한 자리 숫자일 수 있어 그대로 넘기면 잘려나가므로 접두어를 붙여 길이를 보장한다
    amplitude.setUserId(`member-${userProfile.id}`);
    const identifyEvent = new amplitude.Identify();
    if (userProfile.generationNumber !== null) identifyEvent.set('generation', userProfile.generationNumber);
    if (userProfile.partName) identifyEvent.set('track', userProfile.partName);
    identifyEvent.set('is_admin', isAdminRole(userProfile.role));
    amplitude.identify(identifyEvent);
  });
};

export const resetUser = () => {
  void loadAmplitude().then((amplitude) => amplitude?.reset());
};
