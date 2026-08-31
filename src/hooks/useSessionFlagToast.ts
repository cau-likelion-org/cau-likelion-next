import { useEffect, useState } from 'react';

const useSessionFlagToast = (flagKey: string) => {
  const [isOpen, setIsOpen] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(flagKey) === 'true',
  );

  useEffect(() => {
    if (!isOpen) return;
    sessionStorage.removeItem(flagKey);
  }, [isOpen, flagKey]);

  return { isOpen, onHidden: () => setIsOpen(false) };
};

export default useSessionFlagToast;
