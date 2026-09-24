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

// 구글 로그인 버튼처럼 클릭 직후 window.location.href로 즉시 리다이렉트되는 액션 전용.
// 기본 fetch 전송(keepalive 없음)은 페이지 이동으로 요청이 끊길 수 있어, sendBeacon으로 바꿔서 보낸다.
// SDK가 아직 로드 전이면(드묾) beacon으로 바꿀 인스턴스가 없어 일반 track과 동일하게 최선만 다한다.
export const trackBeforeUnload = <E extends AmplitudeEventName>(
  eventName: E,
  eventProperties: AmplitudeEventProperties[E],
) => {
  if (typeof window === 'undefined' || !API_KEY || IS_DEV) return;

  if (ready) {
    void loadAmplitude().then((amplitude) => {
      if (!amplitude) return;
      amplitude.setTransport('beacon');
      amplitude.track(eventName, eventProperties);
    });
    return;
  }

  track(eventName, eventProperties);
};

export const getDeviceType = () => (typeof window !== 'undefined' && window.innerWidth < 900 ? 'mobile' : 'desktop');

// 출석체크·회원가입처럼 한 화면에서 여러 번 제출/실패가 오갈 수 있는 흐름에서, 그 시도들을
// 하나로 묶어 볼 수 있게 방문(마운트)당 하나씩 발급하는 id. react-hooks/purity가 컴포넌트 안에서
// crypto.randomUUID()를 직접 부르는 것도 막을 수 있어 여기 헬퍼로 뺐다.
export const newAttemptId = () => crypto.randomUUID();

// "지원하기" 등 전환 행동을 눌렀는지를 usePageEngagementTracking의 이탈 이벤트에서 판단하기 위한 타임스탬프.

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

// _app.tsx는 "토큰이 없다"고 판단될 때마다 이걸 부르는데, 그중엔 로그인한 적 없는 비로그인
// 방문자의 첫 진입도 포함된다. 그런 경우까지 reset()을 부르면 device_id가 매번 새로 발급돼
// 비로그인 방문자 연속성(유입경로 등)이 깨지므로, 실제로 식별된 유저가 있을 때만 리셋한다.
export const resetUser = () => {
  void loadAmplitude().then((amplitude) => {
    if (!amplitude?.getUserId()) return;
    amplitude.reset();
  });
};
