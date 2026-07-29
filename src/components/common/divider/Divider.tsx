import styled, { css } from 'styled-components';

import { Line } from '@utils/constant/color';

type DividerVariant = 'normal' | 'thick';

export interface DividerProps {
  className?: string;
  variant?: DividerVariant;
  vertical?: boolean;
}

const Divider = ({ className, variant = 'normal', vertical = false }: DividerProps) => {
  return <StyledDivider className={className} $variant={variant} $vertical={vertical} />;
};

export default Divider;

const StyledDivider = styled.div<{ $variant: DividerVariant; $vertical: boolean }>`
  flex-shrink: 0;
  background-color: ${(props) => (props.$vertical || props.$variant !== 'thick' ? Line.strong : Line.subtle)};

  ${(props) =>
    props.$vertical
      ? css`
          align-self: stretch;
          width: 1px;
          height: 100%;
        `
      : css`
          width: 100%;
          height: ${props.$variant === 'thick' ? '12px' : '1px'};
        `}
`;
