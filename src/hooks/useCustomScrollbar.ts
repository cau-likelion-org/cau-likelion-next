import { DependencyList, RefObject, useEffect, useState } from 'react';

// 네이티브 ::-webkit-scrollbar는 브라우저 크롬이라 카드의 overflow:hidden/border-radius에 묶이지
// 않아 모서리를 뚫고 나온다. 직접 그리는 커스텀 오버레이로 대체한다.
// 썸은 드래그 없는 위치 표시용이라 콘텐츠 비율 대신 디자인에 정의된 고정 길이를 쓴다.
const THUMB_HEIGHT = 70;
// ScrollbarTrack의 top/bottom 여백과 반드시 같은 값이어야 한다 — 다르면 썸 위치 계산이 트랙 실제
// 길이와 어긋나 스크롤 끝에서 썸이 트랙 밖으로 튀어나간다.
export const SCROLLBAR_TRACK_INSET = 12;

export interface CustomScrollbarState {
  thumbHeight: number;
  thumbTop: number;
}

/**
 * scrollRef가 가리키는 요소의 스크롤 상태를 관찰해 커스텀 스크롤바 썸의 높이/위치를 계산한다.
 * contentRef는 실제 콘텐츠 높이 변화(이미지 로드 등)를 감지하기 위한 관찰 대상이다.
 */
const useCustomScrollbar = (
  scrollRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  deps: DependencyList = [],
) => {
  const [scrollbar, setScrollbar] = useState<CustomScrollbarState | null>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      if (scrollHeight <= clientHeight) {
        setScrollbar(null);
        return;
      }
      const trackHeight = clientHeight - SCROLLBAR_TRACK_INSET * 2;
      const thumbHeight = Math.min(THUMB_HEIGHT, trackHeight);
      const maxThumbTop = trackHeight - thumbHeight;
      const scrollableDistance = scrollHeight - clientHeight;
      const thumbTop = scrollableDistance > 0 ? (scrollTop / scrollableDistance) * maxThumbTop : 0;
      setScrollbar({ thumbHeight, thumbTop });
    };

    update();
    scrollEl.addEventListener('scroll', update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(scrollEl);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => {
      scrollEl.removeEventListener('scroll', update);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scrollbar;
};

export default useCustomScrollbar;
