import { RefObject, useState } from 'react';

import useScrollToFirstError from './useScrollToFirstError';

// 저장할 때 필수값 검증 결과에 따라 인라인 오류 표시를 켜고, 첫 오류 필드로 스크롤한다
const useRequiredFieldsSave = (containerRef: RefObject<HTMLElement>) => {
  const [showErrors, setShowErrors] = useState(false);
  const scrollToFirstError = useScrollToFirstError(containerRef);

  const validate = (hasError: boolean) => {
    if (hasError) {
      setShowErrors(true);
      scrollToFirstError();
      return false;
    }
    setShowErrors(false);
    return true;
  };

  const hideErrors = () => setShowErrors(false);

  return { showErrors, validate, hideErrors };
};

export default useRequiredFieldsSave;
