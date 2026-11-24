import { useEffect, useRef } from 'react';

// 값은 콜백을 부르는 시점에 지워야, 개발 모드에서 effect가 두 번 실행될 때 첫 실행 정리로 값이 사라지지 않는다.
const useSessionFlash = (key: string, onFlash: (value: string) => void) => {
  const onFlashRef = useRef(onFlash);
  useEffect(() => {
    onFlashRef.current = onFlash;
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const value = sessionStorage.getItem(key);
      if (value === null) return;
      sessionStorage.removeItem(key);
      onFlashRef.current(value);
    });
    return () => cancelAnimationFrame(frame);
  }, [key]);
};

export default useSessionFlash;
