import { ReactNode } from 'react';
import styled from 'styled-components';

import { Label, Orange } from '@utils/constant/color';

export interface ToggleIconProps {
  className?: string;
  active?: boolean;
  disabled?: boolean;
  icon: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  'aria-label': string;
}

const ToggleIcon = ({
  className,
  active = false,
  disabled = false,
  icon,
  onClick,
  type = 'button',
  ...rest
}: ToggleIconProps) => {
  return (
    <StyledButton
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      aria-label={rest['aria-label']}
      $active={active}
    >
      <Halo $active={active} />
      {icon}
    </StyledButton>
  );
};

export default ToggleIcon;

const Halo = styled.span<{ $active: boolean }>`
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? Orange.o500 : Label.assistive)};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
`;

const StyledButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;

  &:not(:disabled):hover ${Halo} {
    opacity: 0.08;
  }

  &:not(:disabled):active ${Halo} {
    opacity: 0.16;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;
