import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import Menu from '@common/menu/Menu';
import Select from '@common/select/Select';
import { IcBehance, IcGithub, IcLink } from '@assets/svg';
import useListboxSelect from 'src/hooks/useListboxSelect';

const LINK_TYPE_LABEL: Record<string, string> = {
  Web: '웹링크',
  GitHub: '깃허브',
  Behance: '비핸스',
};
const LINK_TYPE_ICON: Record<string, ReactNode> = {
  Web: <IcLink width={20} height={20} />,
  GitHub: <IcGithub width={20} height={20} />,
  Behance: <IcBehance width={20} height={14} />,
};

const LinkTypeSelect = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => {
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
    <LinkTypeWrapper ref={wrapperRef} onKeyDownCapture={handleKeyDown} onBlur={handleBlur}>
      <Select
        ref={triggerRef}
        value={value}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
        aria-label="링크 타입 선택"
        hideValue
        leadingIcon={LINK_TYPE_ICON[value]}
      />
      {isOpen && (
        <MenuPositioner>
          <Menu
            items={options.map((option, index) => ({
              id: `${listId}-${index}`,
              label: LINK_TYPE_LABEL[option],
              icon: LINK_TYPE_ICON[option],
              selected: option === value,
              active: index === activeIndex,
              onClick: () => selectOption(option, index),
            }))}
          />
        </MenuPositioner>
      )}
    </LinkTypeWrapper>
  );
};

export default LinkTypeSelect;

const LinkTypeWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  width: fit-content;
`;

const MenuPositioner = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1;
`;
