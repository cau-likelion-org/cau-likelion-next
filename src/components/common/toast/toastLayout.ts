import styled from 'styled-components';

export const WIDE_TOAST_WIDTH = 500;

export const NarrowBreak = styled.br`
  @media (min-width: ${WIDE_TOAST_WIDTH + 40}px) {
    display: none;
  }
`;
