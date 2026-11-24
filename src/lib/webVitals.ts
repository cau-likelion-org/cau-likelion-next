import NextRouter from 'next/router';
import { useReportWebVitals } from 'next/web-vitals';

import { getDeviceType, track } from 'src/lib/amplitude';
import { AmplitudeEventProperties } from 'src/lib/amplitudeEvents';

type WebVitalMetric = Pick<AmplitudeEventProperties['Web Vital Reported'], 'value' | 'rating'> & {
  name: string;
  navigationType: string;
};

// CLS·INP는 페이지를 떠날 때 보고돼 그 사이 라우트가 바뀌었을 수 있으므로, 측정 대상인 첫 진입 라우트로 묶는다
let landingRoute: string | null = null;

export const reportWebVital = (metric: WebVitalMetric) => {
  landingRoute ??= NextRouter.pathname;
  track('Web Vital Reported', {
    metric_name: metric.name,
    value: metric.value,
    rating: metric.rating,
    page_route: landingRoute,
    navigation_type: metric.navigationType,
    device_type: getDeviceType(),
  });
};

const WebVitalsReporter = () => {
  useReportWebVitals(reportWebVital);
  return null;
};

export default WebVitalsReporter;
