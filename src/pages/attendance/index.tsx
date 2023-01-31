import { ReactElement } from 'react';
import styled from 'styled-components';

import BeforeAttendance from '@attendance/BeforeAttendance';
import LayoutAttendance from '@common/layout/LayoutAttendance';

const Attendance = () => {
  return (
    <Wrapper>
      <BeforeAttendance />
    </Wrapper>
  );
};

//레이아웃 지정
Attendance.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAttendance>{page}</LayoutAttendance>;
};

export default Attendance;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
