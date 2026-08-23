import { RefObject, useCallback } from 'react';

// aria-invalid="true"가 붙은 첫 번째 필드로 스크롤+포커스 이동 — TextField/Textarea는 status="negative"일 때 자동으로 붙여줌
const useScrollToFirstError = (containerRef: RefObject<HTMLElement>) => {
  const scrollToFirstError = useCallback(() => {
    requestAnimationFrame(() => {
      const firstInvalid = containerRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid?.focus({ preventScroll: true });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scrollToFirstError;
};

export default useScrollToFirstError;
