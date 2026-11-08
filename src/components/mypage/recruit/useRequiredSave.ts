import { useRef, useState } from 'react';

import useScrollToFirstError from 'src/hooks/useScrollToFirstError';

// 수정 모드에서는 [저장]을 켜 두고, 누를 때 빈 칸이 있으면 인라인 오류를 띄우고 첫 오류 위치로 스크롤한다
const useRequiredSave = (isFilled: boolean, save: () => void, onInvalid?: () => void) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollToFirstError = useScrollToFirstError(wrapperRef);
  const [showErrors, setShowErrors] = useState(false);

  const requestSave = () => {
    if (!isFilled) {
      setShowErrors(true);
      onInvalid?.();
      scrollToFirstError();
      return;
    }
    setShowErrors(false);
    save();
  };

  const hideErrors = () => setShowErrors(false);

  return { wrapperRef, showErrors, requestSave, hideErrors };
};

export default useRequiredSave;
