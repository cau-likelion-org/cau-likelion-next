import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number, bool?: boolean) => {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const tick = () => {
      if (bool) savedCallback.current();
    };
    const timerId = setInterval(tick, delay);
    return () => clearInterval(timerId);
  }, [delay, bool]);
};
