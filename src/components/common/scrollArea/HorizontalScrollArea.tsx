import { PointerEvent, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { BackgroundWhite, Orange } from '@utils/constant/color';

export interface HorizontalScrollAreaProps {
  className?: string;
  children: ReactNode;
}

interface ThumbState {
  width: number;
  left: number;
}

const THUMB_MIN_WIDTH = 40;

const HorizontalScrollArea = ({ className, children }: HorizontalScrollAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null);
  const [thumb, setThumb] = useState<ThumbState | null>(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollEl;
      if (scrollWidth <= clientWidth) return setThumb(null);
      const width = Math.max(clientWidth * (clientWidth / scrollWidth), THUMB_MIN_WIDTH);
      setThumb({ width, left: (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - width) });
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
  }, []);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startScrollLeft: scrollRef.current.scrollLeft };
  };

  const drag = (event: PointerEvent<HTMLDivElement>) => {
    const scrollEl = scrollRef.current;
    if (!dragRef.current || !scrollEl || !thumb) return;
    const ratio = (scrollEl.scrollWidth - scrollEl.clientWidth) / (scrollEl.clientWidth - thumb.width);
    scrollEl.scrollLeft = dragRef.current.startScrollLeft + (event.clientX - dragRef.current.startX) * ratio;
  };

  return (
    <Root className={className}>
      <Scrollable ref={scrollRef}>
        <Content ref={contentRef}>{children}</Content>
      </Scrollable>
      {thumb && (
        <Track>
          <Thumb
            style={{ width: thumb.width, transform: `translateX(${thumb.left}px)` }}
            onPointerDown={startDrag}
            onPointerMove={drag}
            onPointerUp={() => (dragRef.current = null)}
          />
        </Track>
      )}
    </Root>
  );
};

export default HorizontalScrollArea;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  min-width: 0;
`;

const Scrollable = styled.div`
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Content = styled.div`
  width: max-content;
  min-width: 100%;
`;

const Track = styled.div`
  height: 8px;
  border-radius: 100px;
  background-color: ${BackgroundWhite.tertiary};
`;

const Thumb = styled.div`
  height: 100%;
  border-radius: 100px;
  background-color: ${Orange.o500};
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;
