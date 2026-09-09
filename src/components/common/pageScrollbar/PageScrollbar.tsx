import { RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';

import { computeScrollbarState, CustomScrollbarState, SCROLLBAR_TRACK_INSET } from 'src/hooks/useCustomScrollbar';
import { BackgroundWhite, Orange } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';

interface TrackBounds {
  top: number;
  bottomInset: number;
}

export interface PageScrollbarProps {
  contentRef: RefObject<HTMLElement>;
}

// 트랙이 GNB/푸터를 넘지 않도록 contentRef의 화면상 위치를 기준으로 매번 다시 계산한다
const PageScrollbar = ({ contentRef }: PageScrollbarProps) => {
  const [scrollbar, setScrollbar] = useState<CustomScrollbarState | null>(null);
  const [trackBounds, setTrackBounds] = useState<TrackBounds | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => {
      const content = contentRef.current;
      if (!content) return;
      const rect = content.getBoundingClientRect();
      const top = Math.max(rect.top, 0);
      const bottomInset = Math.max(window.innerHeight - rect.bottom, 0);
      setTrackBounds({ top, bottomInset });

      // 썸 크기는 짧아진 트랙 길이에 맞추되, 스크롤 진행률은 실제 clientHeight 기준이어야 끝까지 도달한다
      const trackPixelHeight = window.innerHeight - top - bottomInset;
      setScrollbar(computeScrollbarState(html.scrollTop, html.scrollHeight, html.clientHeight, trackPixelHeight));
    };

    update();
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      resizeObserver.disconnect();
    };
  }, [contentRef]);

  if (!scrollbar || !trackBounds) return null;

  return (
    <PageScrollTrack
      style={{
        top: trackBounds.top + SCROLLBAR_TRACK_INSET,
        bottom: trackBounds.bottomInset + SCROLLBAR_TRACK_INSET,
      }}
    >
      <PageScrollThumb style={{ height: scrollbar.thumbHeight, transform: `translateY(${scrollbar.thumbTop}px)` }} />
    </PageScrollTrack>
  );
};

export default PageScrollbar;

const PageScrollTrack = styled.div`
  position: fixed;
  right: 8px;
  width: 8px;
  border-radius: 100px;
  background-color: ${BackgroundWhite.tertiary};
  pointer-events: none;
  z-index: 9998;

  ${media.xs} {
    display: none;
  }
`;

const PageScrollThumb = styled.div`
  width: 100%;
  border-radius: 100px;
  background-color: ${Orange.o500};
`;
