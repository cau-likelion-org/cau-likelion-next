import { GreyScale } from '@utils/constant/color';
import React from 'react';
import styled from 'styled-components';

const EmptyView = () => {
  return (
    <Wrapper>
      <Text>송하야 세션해줘,,</Text>
    </Wrapper>
  );
};

export default EmptyView;

const Wrapper = styled.div`
  width: 93%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${GreyScale.light};
  height: 330px;
  border-radius: 20px;
  margin: 1rem 0 2rem 0;
`;

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: ${GreyScale.default};
  font-family: 'Gmarket Sans';
`;
