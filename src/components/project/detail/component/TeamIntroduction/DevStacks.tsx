import { IProjectDetail } from '@@types/request';
import { DEV_STACK } from '@utils/constant';
import styled from 'styled-components';

const getDevStack = (number: number) => {
  return DEV_STACK[number];
};

const DevStacks = ({ devStack }: { devStack: IProjectDetail['dev_stack'] }) => {
  return (
    <Wrapper>
      {devStack?.map((stack) => (
        <DevStack key={stack}>{getDevStack(stack)}</DevStack>
      ))}
    </Wrapper>
  );
};

export default DevStacks;
const DevStack = styled.div`
  margin-right: 5px;
`;
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
