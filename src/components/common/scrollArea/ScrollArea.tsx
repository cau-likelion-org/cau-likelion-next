import { DependencyList, ReactNode, useRef } from 'react';
import styled from 'styled-components';

import useCustomScrollbar, { SCROLLBAR_TRACK_INSET } from 'src/hooks/useCustomScrollbar';
import { BackgroundWhite, Orange } from '@utils/constant/color';

export interface ScrollAreaProps {
  className?: string;
  children: ReactNode;
  // 스크롤 대상 콘텐츠가 비동기로 바뀌는 경우(예: 쿼리 데이터), 재계산 트리거로 넘긴다
  deps?: DependencyList;
}

/**
 * 모달 등 카드형 UI 안에서 쓰는 스크롤 영역. 네이티브 스크롤바 대신 오렌지 썸 + 연회색 트랙의
 * 커스텀 스크롤바를 그린다.
 *
 * 부모(카드) 요소가 `display: flex; flex-direction: column;`이어야 하고, 이 컴포넌트 자체에
 * `flex: 1 1 auto`(또는 height/max-height)를 지정해 구체적인 높이를 부여해야 한다
 * (예: styled(ScrollArea)`flex: 1 1 auto;`).
 *
 * 트랙(Track)은 스크롤 요소와 정확히 같은 범위를 감싸는 Root를 기준으로 위치한다 — 부모 카드에
 * 스크롤 영역 밖의 다른 형제(예: 하단 고정 Actions 푸터)가 있으면, 트랙이 부모 카드 전체를
 * 기준으로 위치할 경우 실제 스크롤 가능 높이보다 트랙이 더 길어져 썸이 끝까지 내려가지 않는다.
 * Root 내부는 height:100% 퍼센트 트릭 대신 중첩 flex로 크기를 전달한다(퍼센트 높이는 부모의
 * height가 CSS상 명시값이 아니면 해석되지 않기 때문).
 */
const ScrollArea = ({ className, children, deps = [] }: ScrollAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollbar = useCustomScrollbar(scrollRef, contentRef, deps);

  return (
    <Root className={className}>
      <Scrollable ref={scrollRef}>
        <div ref={contentRef}>{children}</div>
      </Scrollable>
      {scrollbar && (
        <Track>
          <Thumb style={{ height: scrollbar.thumbHeight, transform: `translateY(${scrollbar.thumbTop}px)` }} />
        </Track>
      )}
    </Root>
  );
};

export default ScrollArea;

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Scrollable = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Track = styled.div`
  position: absolute;
  top: ${SCROLLBAR_TRACK_INSET}px;
  right: 8px;
  bottom: ${SCROLLBAR_TRACK_INSET}px;
  width: 8px;
  border-radius: 100px;
  background-color: ${BackgroundWhite.tertiary};
  pointer-events: none;
`;

const Thumb = styled.div`
  width: 100%;
  border-radius: 100px;
  background-color: ${Orange.o500};
`;
