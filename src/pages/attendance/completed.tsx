import { ReactElement } from 'react';

import styled from 'styled-components';

import LayoutAttendance from '@common/layout/LayoutAttendance';
import CompletedSection from '@attendance/completed/CompletedSection';

const Complete = () => {
  return (
    <Wrapper>
      <CompletedSection />
    </Wrapper>
  );
};

//레이아웃 지정
Complete.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAttendance>{page}</LayoutAttendance>;
};

export default Complete;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
