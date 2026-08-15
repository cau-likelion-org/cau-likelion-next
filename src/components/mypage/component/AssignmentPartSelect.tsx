import { useState } from 'react';
import styled from 'styled-components';

import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';
import { IcCaretDown, IcChevronDown } from '@assets/svg';
import { BackgroundWhite, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface AssignmentPartSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const AssignmentPartSelect = ({ value, options, onChange }: AssignmentPartSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: onChange,
  });

  return (
    <Wrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Trigger
        ref={triggerRef}
        role="combobox"
        tabIndex={0}
        aria-label="파트 선택"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <span>{value}</span>
        <DesktopCaret>
          <IcChevronDown width={16} height={16} />
        </DesktopCaret>
        <MobileCaret>
          <IcCaretDown width={20} height={20} />
        </MobileCaret>
      </Trigger>
      {isOpen && (
        <ListboxOptions
          listId={listId}
          options={options}
          value={value}
          activeIndex={activeIndex}
          onSelect={selectOption}
        />
      )}
    </Wrapper>
  );
};

export default AssignmentPartSelect;

const Wrapper = styled.div`
  position: relative;
`;

const Trigger = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 8px;
  background-color: ${BackgroundWhite.tertiary};
  color: ${Label.normal};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  ${typographyCss(Typography.body2Normal.medium)}

  /* Figma 모바일: 검정 4% 회색 배경 위 텍스트 버튼.
     좌우 7px 패딩은 배경이 제목 왼쪽 끝(x=0)에 맞도록 하는 값 (텍스트는 7px 들여씀) */
  @media (max-width: 900px) {
    padding: 4px 7px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.04);
    color: ${Label.strong};
    ${typographyCss(Typography.headline2.medium)}
  }
`;

const DesktopCaret = styled.span`
  display: inline-flex;

  @media (max-width: 900px) {
    display: none;
  }
`;

// Figma: 텍스트는 Label/Strong(#000)이지만 캐럿만 Label/Alternative로 흐리다
const MobileCaret = styled.span`
  display: none;

  @media (max-width: 900px) {
    display: inline-flex;
    color: ${Label.alternative};
  }
`;
