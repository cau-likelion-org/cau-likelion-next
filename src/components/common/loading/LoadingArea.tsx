import { ReactNode } from 'react';
import styled from 'styled-components';

const LoadingArea = ({ minHeight, children }: { minHeight: number; children: ReactNode }) => (
  <Wrapper $minHeight={minHeight}>{children}</Wrapper>
);

export default LoadingArea;

const Wrapper = styled.div<{ $minHeight: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: ${(props) => props.$minHeight}px;
`;
