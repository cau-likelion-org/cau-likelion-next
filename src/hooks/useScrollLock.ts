import { useEffect } from 'react';

let lockCount = 0;
let previousHtmlOverflow = '';
let previousBodyOverflow = '';
let previousBodyPaddingRight = '';

const useScrollLock = (isLocked = true) => {
  useEffect(() => {
    if (!isLocked) return;

    const html = document.documentElement;
    const { body } = document;

    if (lockCount === 0) {
      previousHtmlOverflow = html.style.overflow;
      previousBodyOverflow = body.style.overflow;
      previousBodyPaddingRight = body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - html.clientWidth;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount > 0) return;

      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [isLocked]);
};

export default useScrollLock;
