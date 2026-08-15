import styled from 'styled-components';

import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';

export interface PageLoadingGateProps {
  isError?: boolean;
}

// 페이지 최상단에서 본인 프로필 조회가 끝날 때까지 아무것도 안 보여주던 자리에 대신 렌더
const PageLoadingGate = ({ isError }: PageLoadingGateProps) => (
  <Wrapper>{isError ? <EmptyState variant="error" /> : <CircularLoading size={32} />}</Wrapper>
);

export default PageLoadingGate;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 60vh;
`;
