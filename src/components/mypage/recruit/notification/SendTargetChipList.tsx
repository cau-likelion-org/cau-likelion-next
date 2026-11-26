import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Chip from '@common/chip/Chip';
import { IcCaretDown, IcCaretUp } from '@assets/svg';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export const useChipRowOverflow = (items: readonly unknown[]) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const checkOverflow = () => {
      setIsFaded(el.scrollWidth - el.scrollLeft - el.clientWidth > 1);
      // 펼쳐진 상태(줄바꿈)에서는 scrollWidth가 오버플로우를 반영하지 않으므로, 접힌 상태에서 잰 값만 반영한다
      if (!isExpanded) setHasOverflow(el.scrollWidth - el.clientWidth > 1);
    };
    checkOverflow();
    el.addEventListener('scroll', checkOverflow);
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', checkOverflow);
      observer.disconnect();
    };
  }, [items, isExpanded]);

  return { rowRef, isExpanded, toggleExpanded: () => setIsExpanded((prev) => !prev), isFaded, hasOverflow };
};

export interface SendTargetChip {
  key: string;
  label: string;
  onRemove?: () => void;
}

const SendTargetChipList = ({ chips }: { chips: SendTargetChip[] }) => {
  const { rowRef, isExpanded, toggleExpanded, isFaded, hasOverflow } = useChipRowOverflow(chips);

  return (
    <>
      <SendTargetChipRow ref={rowRef} $expanded={isExpanded} $faded={isFaded}>
        {chips.map((chip) => (
          <TargetChip
            key={chip.key}
            size="xsmall"
            trailingIcon={
              chip.onRemove && (
                <RemoveButton type="button" aria-label={`${chip.label} 삭제`} onClick={chip.onRemove}>
                  ×
                </RemoveButton>
              )
            }
          >
            {chip.label}
          </TargetChip>
        ))}
      </SendTargetChipRow>
      {hasOverflow ? (
        <CountToggle type="button" aria-expanded={isExpanded} onClick={toggleExpanded}>
          <CountText>총 {chips.length}명</CountText>
          {isExpanded ? <IcCaretUp width={16} height={16} /> : <IcCaretDown width={16} height={16} />}
        </CountToggle>
      ) : (
        <CountToggle as="span">
          <CountText>총 {chips.length}명</CountText>
        </CountToggle>
      )}
    </>
  );
};

export default SendTargetChipList;

export const SendTargetChipRow = styled.div<{ $expanded: boolean; $faded: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1 0 0;
  min-width: 0;
  min-height: 24px;

  ${(props) =>
    props.$expanded
      ? `
    flex-wrap: wrap;
  `
      : `
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    ${
      props.$faded
        ? `
      mask-image: linear-gradient(to right, black calc(100% - 32px), transparent 100%);
      -webkit-mask-image: linear-gradient(to right, black calc(100% - 32px), transparent 100%);
    `
        : ''
    }
  `}
`;

const TargetChip = styled(Chip)`
  flex-shrink: 0;
`;

const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  font-size: 12px;
  line-height: 1;
  color: inherit;
  cursor: pointer;
`;

const CountToggle = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  color: ${Label.normal};
  cursor: pointer;
`;

const CountText = styled.span`
  color: ${Label.alternative};
  opacity: 0.74;
  ${typographyCss({ ...Typography.label2.bold, fontWeight: 500 })}
`;
