import { useEffect } from 'react';
import { Router } from 'next/router';
import { track, getLastNextActionAt } from 'src/lib/amplitude';
import { AmplitudeEventName, AmplitudeEventProperties } from 'src/lib/amplitudeEvents';

// react-hooks/purity가 useEffect 안의 Date.now() 호출도 막아서, 계측용 타임스탬프는 밖에서 받는다
const now = () => Date.now();

const SCROLL_THRESHOLDS = [25, 50, 75, 100];

const getScrollPercent = () => {
  const html = document.documentElement;
  const scrollable = html.scrollHeight - html.clientHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.round((html.scrollTop / scrollable) * 100));
};

interface UsePageEngagementTrackingOptions {
  pagePath: string;
  exitEvent: AmplitudeEventName;
  // 넘기면 스크롤 깊이(25/50/75/100%)도 같이 재고, exit 이벤트에 max_scroll_depth를 함께 보낸다
  scrollDepthEvent?: AmplitudeEventName;
  // 이 값이 바뀔 때마다(예: 갤러리 탭 전환) 이전 스코프 기준으로 exit을 먼저 보내고 새로 잰다
  scopeKey?: string | number;
  extraProperties?: Record<string, unknown>;
  enabled?: boolean;
  // true면 exit 이벤트에 exit_type(사이트 내 다른 페이지로 이동/실제 이탈)·next_path·took_next_action을 함께 보낸다.
  // scopeKey로 재측정하는 스코프(예: 갤러리 탭 전환)에서는 그 전환 자체가 라우트 이동이 아니라서 켜지 않는다.
  trackExitContext?: boolean;
}

// 페이지(또는 스코프) 체류시간과, 필요하면 스크롤 깊이까지 재서 이탈 시점에 함께 보낸다
const usePageEngagementTracking = ({
  pagePath,
  exitEvent,
  scrollDepthEvent,
  scopeKey,
  extraProperties,
  enabled = true,
  trackExitContext = false,
}: UsePageEngagementTrackingOptions) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const enteredAt = now();
    const reachedDepths = new Set<number>();
    let maxDepth = 0;
    let exited = false;
    let nextPath: string | null = null;

    // 이 훅은 exitEvent/scrollDepthEvent로 어떤 이벤트든 받는 범용 엔진이라, 프로퍼티를 여기서 동적으로
    // 조립한다. 호출부가 이벤트명과 옵션(scrollDepthEvent/trackExitContext)을 맞게 짝지었다는 전제로 캐스팅한다.
    const handleScroll = () => {
      const percent = getScrollPercent();
      maxDepth = Math.max(maxDepth, percent);
      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (percent >= threshold && !reachedDepths.has(threshold) && scrollDepthEvent) {
          reachedDepths.add(threshold);
          const properties = { depth_percent: threshold, page_path: pagePath, ...extraProperties };
          track(scrollDepthEvent, properties as AmplitudeEventProperties[typeof scrollDepthEvent]);
        }
      });
    };

    const handleRouteChangeStart = (url: string) => {
      nextPath = url;
    };

    const trackExit = () => {
      if (exited) return;
      exited = true;
      const properties = {
        page_path: pagePath,
        time_on_page_ms: now() - enteredAt,
        ...(scrollDepthEvent ? { max_scroll_depth: maxDepth } : {}),
        ...(trackExitContext
          ? {
              exit_type: nextPath ? 'internal_navigation' : 'left_site',
              ...(nextPath ? { next_path: nextPath } : {}),
              took_next_action: getLastNextActionAt() >= enteredAt,
            }
          : {}),
        ...extraProperties,
      };
      track(exitEvent, properties as AmplitudeEventProperties[typeof exitEvent]);
    };

    if (scrollDepthEvent) window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pagehide', trackExit);
    if (trackExitContext) Router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      if (scrollDepthEvent) window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', trackExit);
      if (trackExitContext) Router.events.off('routeChangeStart', handleRouteChangeStart);
      trackExit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey, enabled]);
};

export default usePageEngagementTracking;
