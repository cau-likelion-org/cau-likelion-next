import type { ReactNode } from 'react';
import styled from 'styled-components';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import { Label } from '@utils/constant/color';

export interface PaginationNavigationProps {
  className?: string;
  variant?: 'extended' | 'compact' | 'minimize';
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  leadingContent?: ReactNode;
  trailingContent?: ReactNode;
}

const VARIANT_WINDOW = {
  extended: { siblingCount: 3, boundaryCount: 1 },
  compact: { siblingCount: 1, boundaryCount: 1 },
} as const;

type PageItem = number | 'ellipsis';

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

const getPageList = (total: number, current: number, siblingCount: number, boundaryCount: number): PageItem[] => {
  const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (total <= totalPageNumbers) {
    return range(1, total);
  }

  const leftSibling = Math.max(current - siblingCount, boundaryCount + 2);
  const rightSibling = Math.min(current + siblingCount, total - boundaryCount - 1);

  const showLeftEllipsis = leftSibling > boundaryCount + 2;
  const showRightEllipsis = rightSibling < total - boundaryCount - 1;

  const startPages = range(1, boundaryCount);
  const endPages = range(total - boundaryCount + 1, total);

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, boundaryCount + siblingCount * 2 + 2), 'ellipsis', ...endPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [...startPages, 'ellipsis', ...range(total - (boundaryCount + siblingCount * 2 + 1), total)];
  }

  return [...startPages, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', ...endPages];
};

const PaginationNavigation = ({
  className,
  variant = 'extended',
  currentPage,
  totalPage,
  onPageChange,
  leadingContent,
  trailingContent,
}: PaginationNavigationProps) => {
  if (variant === 'minimize') {
    return (
      <MinimizeWrapper className={className} role="navigation" aria-label="페이지네이션">
        <ChevronButton
          type="button"
          aria-label="이전 페이지"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <MdChevronLeft size={16} />
        </ChevronButton>
        <MinimizeCounter>
          {currentPage}/{totalPage}
        </MinimizeCounter>
        <ChevronButton
          type="button"
          aria-label="다음 페이지"
          disabled={currentPage >= totalPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <MdChevronRight size={16} />
        </ChevronButton>
      </MinimizeWrapper>
    );
  }

  const { siblingCount, boundaryCount } = VARIANT_WINDOW[variant];
  const pages = getPageList(totalPage, currentPage, siblingCount, boundaryCount);

  return (
    <Wrapper className={className} variant={variant} role="navigation" aria-label="페이지네이션">
      {variant === 'extended' && leadingContent && <SideContent side="leading">{leadingContent}</SideContent>}
      <Container>
        <ChevronButton
          type="button"
          aria-label="이전 페이지"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <MdChevronLeft size={16} />
        </ChevronButton>
        <PageList>
          {pages.map((page, index) =>
            page === 'ellipsis' ? (
              <Ellipsis key={`ellipsis-${index}`}>…</Ellipsis>
            ) : (
              <PageButton
                key={page}
                type="button"
                aria-current={page === currentPage ? 'page' : undefined}
                selected={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PageButton>
            ),
          )}
        </PageList>
        <ChevronButton
          type="button"
          aria-label="다음 페이지"
          disabled={currentPage >= totalPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <MdChevronRight size={16} />
        </ChevronButton>
      </Container>
      {variant === 'extended' && trailingContent && <SideContent side="trailing">{trailingContent}</SideContent>}
    </Wrapper>
  );
};

export default PaginationNavigation;

const Wrapper = styled.div<{ variant: 'extended' | 'compact' }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props.variant === 'extended' ? '760px' : '100%')};
  max-width: 100%;
`;

const SideContent = styled.div<{ side: 'leading' | 'trailing' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${(props) => (props.side === 'leading' ? 'left: 0;' : 'right: 0;')}
  display: flex;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 32px;
`;

const PageList = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
`;

const ChevronButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  padding: 0;
  color: ${Label.alternative};
  cursor: pointer;

  &:disabled {
    opacity: 0.28;
    cursor: default;
  }
`;

const PageButton = styled.button<{ selected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  min-width: 20px;
  height: 30px;
  border: none;
  background: none;
  padding: 4px 0;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.467;
  letter-spacing: 0.144px;
  font-weight: ${(props) => (props.selected ? 500 : 400)};
  color: ${(props) => (props.selected ? Label.strong : Label.neutral)};

  &::before {
    content: '';
    position: absolute;
    inset: -1px -7px;
    border-radius: 6px;
    background-color: ${Label.normal};
    opacity: ${(props) => (props.selected ? 0.09 : 0)};
    pointer-events: none;
  }

  &:hover::before {
    opacity: 0.08;
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 30px;
  font-size: 15px;
  line-height: 1.467;
  letter-spacing: 0.144px;
  color: ${Label.alternative};
`;

const MinimizeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const MinimizeCounter = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  letter-spacing: 0.2522px;
  color: ${Label.neutral};
`;
