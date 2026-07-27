import { keyframes } from 'styled-components';

export const skeletonPulse = keyframes`
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;
