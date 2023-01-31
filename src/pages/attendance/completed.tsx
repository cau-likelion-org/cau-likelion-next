import Track from '@attendance/completed/Track';
import LayoutAttendance from '@common/layout/LayoutAttendance';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { AttendanceListData, MemberStack } from '@@types/request';
import { useQuery } from 'react-query';
import { getAttendanceList } from 'src/apis/attendance';
import { AxiosResponse } from 'axios';

const Complete = () => {
  const trackStacks: MemberStack[] = ['pm', 'design', 'frontend', 'backend'];
  const { data, isLoading } = useQuery<AttendanceListData>(
    ['getAttendanceList'],
    getAttendanceList,
  );
  if (isLoading) {
    return <div>로딩중</div>;
  }
  return (
    <Wrapper>
      <PaddingWrapper>
        <SubTitle>출석체크</SubTitle>
        <Title>오늘의 출석부</Title>
        {trackStacks.map((track, index) => (
          <Track track={track} key={index} trackData={data![track]} />
        ))}
      </PaddingWrapper>
    </Wrapper>
  );
};

export default Complete;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const PaddingWrapper = styled.div`
  width: 100%;
  padding: 10rem 35rem;
  @media (max-width: 1660px) {
    padding: 100px 200px 100px 200px;
  }
  @media (max-width: 1440px) {
    padding: 100px 150px 100px 150px;
  }
  @media (max-width: 1280px) {
    padding: 100px 120px 100px 120px;
  }
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 4rem;
`;
const SubTitle = styled.div`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 2rem;
`;
Complete.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAttendance>{page}</LayoutAttendance>;
};
