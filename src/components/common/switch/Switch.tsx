import styled from 'styled-components';

import { BackgroundWhite, Line, Orange } from '@utils/constant/color';

export interface SwitchProps {
  className?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label': string;
}

const Switch = ({ className, checked, onChange, disabled = false, 'aria-label': ariaLabel }: SwitchProps) => {
  return (
    <Root
      className={className}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
    >
      <Track $on={checked}>
        <Thumb />
      </Track>
    </Root>
  );
};

export default Switch;

const Root = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

const Track = styled.span<{ $on: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.$on ? 'flex-end' : 'flex-start')};
  width: 39px;
  padding: 3px;
  border-radius: 75px;
  background-color: ${(props) => (props.$on ? Orange.o500 : Line.strong)};
  transition: background-color 0.15s ease;
`;

const Thumb = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 750px;
  background-color: ${BackgroundWhite.primary};
`;
