import { captureError, isReporterReady, loadReporter } from 'src/lib/errorReporter';

// SDK가 붙기 전에 터진 에러를 놓치지 않도록, 네이티브 핸들러만 먼저 걸어둔다.
// 이 파일 자체는 1kB 미만이고 Sentry SDK는 유휴 시점에 별도 청크로 내려받는다.
const handleError = (event: ErrorEvent) => {
  if (isReporterReady()) return;
  captureError(event.error ?? event.message, { buffered_as: 'error' });
};

const handleRejection = (event: PromiseRejectionEvent) => {
  if (isReporterReady()) return;
  captureError(event.reason, { buffered_as: 'unhandledrejection' });
};

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleRejection);

  const start = () => {
    void loadReporter().then(() => {
      // 이 시점부터는 Sentry 자체 전역 핸들러가 잡으므로 중복 보고를 막는다
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    });
  };

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(start, { timeout: 3000 });
  } else {
    window.setTimeout(start, 1500);
  }
}
