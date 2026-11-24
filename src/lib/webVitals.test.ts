import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = vi.hoisted(() => ({ pathname: '/' }));
const track = vi.hoisted(() => vi.fn());

vi.mock('next/router', () => ({ default: router }));
vi.mock('src/lib/amplitude', () => ({ track, getDeviceType: () => 'mobile' }));

const loadReporter = async () => (await import('./webVitals')).reportWebVital;

const metric = (name: string, value: number) => ({
  name,
  value,
  rating: 'good' as const,
  navigationType: 'navigate',
});

describe('reportWebVital', () => {
  beforeEach(() => {
    vi.resetModules();
    track.mockClear();
    router.pathname = '/';
  });

  it('지표를 Web Vital Reported 이벤트로 보낸다', async () => {
    router.pathname = '/project/[[...project_id]]';
    const reportWebVital = await loadReporter();

    reportWebVital(metric('LCP', 1200));

    expect(track).toHaveBeenCalledWith('Web Vital Reported', {
      metric_name: 'LCP',
      value: 1200,
      rating: 'good',
      page_route: '/project/[[...project_id]]',
      navigation_type: 'navigate',
      device_type: 'mobile',
    });
  });

  it('라우트가 바뀐 뒤 보고된 지표도 첫 진입 라우트로 묶는다', async () => {
    const reportWebVital = await loadReporter();

    reportWebVital(metric('FCP', 800));
    router.pathname = '/about';
    reportWebVital(metric('CLS', 0.05));

    expect(track).toHaveBeenLastCalledWith(
      'Web Vital Reported',
      expect.objectContaining({ metric_name: 'CLS', page_route: '/' }),
    );
  });
});
