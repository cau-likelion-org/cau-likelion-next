import { DependencyList, RefObject, useEffect, useState } from 'react';

// 네이티브 ::-webkit-scrollbar는 브라우저 크롬이라 카드의 overflow:hidden/border-radius에 묶이지
// 않아 모서리를 뚫고 나온다. 직접 그리는 커스텀 오버레이로 대체하되, 썸 길이는 네이티브와 동일하게
// 실제 콘텐츠 비율(clientHeight/scrollHeight)로 계산한다.
const THUMB_MIN_HEIGHT = 24;
// ScrollbarTrack의 top/bottom 여백과 반드시 같은 값이어야 한다 — 다르면 썸 위치 계산이 트랙 실제
// 길이와 어긋나 스크롤 끝에서 썸이 트랙 밖으로 튀어나간다.
export const SCROLLBAR_TRACK_INSET = 12;

export interface CustomScrollbarState {
  thumbHeight: number;
  thumbTop: number;
}

// trackHeight는 시각적 트랙 길이(헤더/푸터를 피해 clientHeight보다 짧을 수 있음) — 진행률(scrollProgress)은
// 항상 실제 clientHeight 기준이어야 스크롤 끝에서 썸도 트랙 끝까지 도달한다.
export const computeScrollbarState = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  trackHeight: number = clientHeight,
): CustomScrollbarState | null => {
  if (scrollHeight <= clientHeight) return null;
  const trackHeightInternal = trackHeight - SCROLLBAR_TRACK_INSET * 2;
  const thumbHeight = Math.max(trackHeightInternal * (clientHeight / scrollHeight), THUMB_MIN_HEIGHT);
  const maxThumbTop = trackHeightInternal - thumbHeight;
  const scrollableDistance = scrollHeight - clientHeight;
  const scrollProgress = scrollableDistance > 0 ? scrollTop / scrollableDistance : 0;
  const thumbTop = scrollProgress * maxThumbTop;
  return { thumbHeight, thumbTop };
};

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
      setScrollbar(computeScrollbarState(scrollTop, scrollHeight, clientHeight));
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
