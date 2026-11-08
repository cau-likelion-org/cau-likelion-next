import { useEffect, useState } from 'react';

// 탭이 백그라운드에 있어 interval이 밀려도 남은 시간이 틀어지지 않도록 종료 시각 기준으로 계산한다
const getRemainingSeconds = (endAt: number) => Math.max(0, Math.ceil((endAt - Date.now()) / 1000));

const useCountdown = () => {
  const [endAt, setEndAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (endAt === null) return;
    const timer = setInterval(() => {
      const remaining = getRemainingSeconds(endAt);
      setRemainingSeconds(remaining);
      if (remaining === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [endAt]);

  const start = (seconds: number) => {
    setEndAt(Date.now() + seconds * 1000);
    setRemainingSeconds(seconds);
  };

  const stop = () => {
    setEndAt(null);
    setRemainingSeconds(0);
  };

  return {
    remainingSeconds,
    isRunning: endAt !== null && remainingSeconds > 0,
    isExpired: endAt !== null && remainingSeconds === 0,
    start,
    stop,
  };
};

export const formatCountdown = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default useCountdown;
