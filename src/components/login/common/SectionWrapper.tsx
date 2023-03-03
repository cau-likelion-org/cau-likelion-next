import React from 'react';
import styled from 'styled-components';

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 60rem;
  height: 50rem;
  @media (max-width: 900px) {
    height: 100%;
    align-items: center;
    justify-content: center;
  }
`;
