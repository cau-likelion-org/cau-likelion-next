import { useEffect } from 'react';

// 저장하지 않은 변경 여부를 부모에 알리고, 화면이 사라지면 변경사항도 함께 사라지므로 false로 되돌린다
const useReportDirty = (isDirty: boolean, onDirtyChange?: (isDirty: boolean) => void) => {
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
};

export default useReportDirty;
