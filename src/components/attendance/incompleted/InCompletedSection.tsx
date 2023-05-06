import styled from 'styled-components';
import { Primary } from '@utils/constant/color';
import AttendanceBox from './component/AttendanceBox';
import { useQuery } from 'react-query';
import { TodayAttendanceData } from '@@types/request';
import { getAttendance } from 'src/apis/attendance';
import Loading from '@common/loading/Loading';
import { useRecoilValue } from 'recoil';
import { token } from '@utils/state';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';

const IncompletedSection = () => {
  const tokens = useRecoilValue(token);
  const router = useRouter();
  const { data, isLoading } = useQuery<TodayAttendanceData, AxiosError>(['attendance'], () => getAttendance(tokens), {
    retry: false,
    onError: (error) => {
      if (error.response?.status == 400) {
        alert('출석 가능일이 아닙니다!');
        router.push('/');
      }
      if (error.response?.status == 405) {
        router.push('/attendance/completed');
      }
      if (error.response?.status == 401) {
        alert('현재 활동 중인 아기사자가 아닙니다!');
        router.push('/');
      }
    },
    onSuccess: (data) => {
      if (data && (data.attendance_result === 2 || data.attendance_result === 1)) {
        router.push('/attendance/completed');
      }
    },
  });
  if (isLoading) return <Loading />;
  return (
    <CircleWrapper>
      <Circle />
      <Circle2 />
      <Circle />
      <AttendanceBox data={data!} />
    </CircleWrapper>
  );
};

export default IncompletedSection;

const CircleWrapper = styled.div`
  position: relative;
  width: 640px;
  height: 640px;
  @media (max-width: 900px) {
    width: 350px;
    height: 350px;
  }
`;
const Circle = styled.div`
  position: absolute;
  border-color: ${Primary.default};
  border-style: solid;
  width: 640px;
  height: 640px;
  border-radius: 100%;
  border-width: 2px;
  @media (max-width: 900px) {
    width: 350px;
    height: 350px;
  }
`;

const Circle2 = styled(Circle)`
  top: 2%;
  left: 2%;
  background-color: white;
`;
