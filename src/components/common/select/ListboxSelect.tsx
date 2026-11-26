import { ReactNode, useState } from 'react';
import styled from 'styled-components';

import Select from '@common/select/Select';
import ListboxOptions from '@common/select/ListboxOptions';
import useListboxSelect from 'src/hooks/useListboxSelect';

interface ListboxSelectProps {
  className?: string;
  heading?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  ariaLabel?: string;
  status?: 'normal' | 'positive' | 'negative';
  description?: string;
  leadingIcon?: ReactNode;
  hideValue?: boolean;
  fullWidth?: boolean;
}

const ListboxSelect = ({
  className,
  heading = '',
  options,
  value,
  onChange,
  required,
  placeholder,
  disabled = false,
  readOnly = false,
  ariaLabel,
  status,
  description,
  leadingIcon,
  hideValue,
  fullWidth = false,
}: ListboxSelectProps) => {
  const isInteractive = !disabled && !readOnly;
  const [isOpen, setIsOpen] = useState(false);
  if (!isInteractive && isOpen) setIsOpen(false);
  const { listId, wrapperRef, triggerRef, activeIndex, handleKeyDown, handleBlur, selectOption } = useListboxSelect({
    isOpen,
    options,
    value,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onSelect: onChange,
  });

  return (
    <Wrapper
      className={className}
      $fullWidth={fullWidth}
      ref={wrapperRef}
      onKeyDownCapture={isInteractive ? handleKeyDown : undefined}
      onBlur={handleBlur}
    >
      <Select
        ref={triggerRef}
        heading={heading}
        required={required}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onClick={() => {
          if (isInteractive) setIsOpen((prev) => !prev);
        }}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-controls={listId}
        status={status}
        description={description}
        leadingIcon={leadingIcon}
        hideValue={hideValue}
      >
        {isOpen && (
          <ListboxOptions
            listId={listId}
            options={options}
            value={value}
            activeIndex={activeIndex}
            onSelect={selectOption}
          />
        )}
      </Select>
    </Wrapper>
  );
};

export default ListboxSelect;

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  position: relative;
  width: ${(props) => (props.$fullWidth ? '100%' : '160px')};
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${(props) =>
    !props.$fullWidth &&
    `
    @media (max-width: 600px) {
      flex: 1 0 0;
      min-width: 0;
      width: auto;
    }
  `}
`;
