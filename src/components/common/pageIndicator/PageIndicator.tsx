import styled, { css } from 'styled-components';

import { CoolNeutral } from '@utils/constant/color';

export interface PageIndicatorProps {
  className?: string;
  currentPage: number;
  totalPage: number;
  size?: 'small' | 'medium';
  alternative?: boolean;
}

const SIZE_STYLE = {
  small: { fontSize: 13, lineHeight: 1.385, letterSpacing: '0.2522px', paddingX: 10, paddingY: 4, gap: 3 },
  medium: { fontSize: 15, lineHeight: 1.467, letterSpacing: '0.144px', paddingX: 12, paddingY: 6, gap: 4 },
} as const;

const PageIndicator = ({
  className,
  currentPage,
  totalPage,
  size = 'medium',
  alternative = false,
}: PageIndicatorProps) => {
  const style = SIZE_STYLE[size];

  return (
    <Wrapper className={className} alternative={alternative} role="status">
      <Content style={style} alternative={alternative}>
        <Current alternative={alternative}>{currentPage}</Current>
        <Separator alternative={alternative}>/</Separator>
        <Total alternative={alternative}>{totalPage}</Total>
      </Content>
    </Wrapper>
  );
};

export default PageIndicator;

const Wrapper = styled.div<{ alternative: boolean }>`
  position: relative;
  display: inline-flex;
  border-radius: 1000px;
  overflow: hidden;
  background-color: ${(props) => (props.alternative ? 'rgba(70, 71, 76, 0.61)' : 'rgba(0, 0, 0, 0.28)')};

  ${(props) =>
    !props.alternative &&
    css`
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
    `}
`;

const Content = styled.div<{ style: (typeof SIZE_STYLE)[keyof typeof SIZE_STYLE]; alternative: boolean }>`
  display: flex;
  align-items: baseline;
  gap: ${(props) => props.style.gap}px;
  padding: ${(props) => props.style.paddingY}px ${(props) => props.style.paddingX}px;
  font-size: ${(props) => props.style.fontSize}px;
  line-height: ${(props) => props.style.lineHeight};
  letter-spacing: ${(props) => props.style.letterSpacing};
  color: ${(props) => (props.alternative ? '#FFFFFF' : CoolNeutral.neutral70)};
`;

const Current = styled.span<{ alternative: boolean }>`
  font-weight: 600;
  opacity: ${(props) => (props.alternative ? 0.88 : 0.74)};
`;

const Separator = styled.span<{ alternative: boolean }>`
  font-weight: 400;
  opacity: ${(props) => (props.alternative ? 0.52 : 0.28)};
`;

const Total = styled.span<{ alternative: boolean }>`
  font-weight: 600;
  opacity: ${(props) => (props.alternative ? 0.88 : 0.74)};
`;
