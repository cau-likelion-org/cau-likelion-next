import styled from 'styled-components';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import CircularLoading from './CircularLoading';

const Loading = () => {
  return (
    <LayoutFullWidth>
      <SpinnerArea>
        <CircularLoading size={48} />
      </SpinnerArea>
    </LayoutFullWidth>
  );
};

export default Loading;

const SpinnerArea = styled.div`
  width: 100%;
  flex: 1 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
