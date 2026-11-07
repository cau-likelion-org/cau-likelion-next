import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// 저장하지 않은 변경이 있을 때 페이지 이동·새로고침·직접 이탈(닫기, 탭 전환 등)을 막고 확인을 받는다
const useLeaveGuard = (isDirty: boolean) => {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const pendingLeaveRef = useRef<(() => void) | null>(null);
  const bypassRef = useRef(false);

  // 이탈을 허용한 뒤 변경사항이 사라지면(탭 전환 등으로 화면이 바뀐 경우) 다시 가드한다
  useEffect(() => {
    if (!isDirty) bypassRef.current = false;
  }, [isDirty]);

  // 사이드바/뒤로가기 등 라우트 변경 가로채기
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (bypassRef.current || !isDirty) return;
      pendingLeaveRef.current = () => router.push(url);
      setIsConfirmOpen(true);
      const message = '저장하지 않은 변경사항이 있어 이동을 취소함';
      // Next가 보내는 것과 같은 (error, url, options) 형태로 보내야 이 이벤트를 듣는 다른 리스너가 깨지지 않는다
      router.events.emit('routeChangeError', new Error(message), url, { shallow: false });
      throw message;
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => router.events.off('routeChangeStart', handleRouteChangeStart);
  }, [isDirty, router]);

  // 새로고침/탭 닫기
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || bypassRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const requestLeave = (leave: () => void) => {
    if (!isDirty || bypassRef.current) {
      leave();
      return;
    }
    pendingLeaveRef.current = leave;
    setIsConfirmOpen(true);
  };

  const confirmLeave = () => {
    bypassRef.current = true;
    setIsConfirmOpen(false);
    const leave = pendingLeaveRef.current;
    pendingLeaveRef.current = null;
    leave?.();
  };

  const cancelLeave = () => {
    pendingLeaveRef.current = null;
    setIsConfirmOpen(false);
  };

  // 저장 직후처럼 변경사항이 남아 있어도 확인 없이 떠나야 할 때
  const allowLeave = () => {
    bypassRef.current = true;
  };

  return { isConfirmOpen, requestLeave, confirmLeave, cancelLeave, allowLeave };
};

export default useLeaveGuard;
