import { useQuery } from 'react-query';
<<<<<<< HEAD
import { TodayAttendanceListData, MemberStack, MemberStackKor } from '@@types/request';
=======
import { AttendanceListData, MemberStack, MemberStackKor } from '@@types/request';
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

import { getAttendanceList } from 'src/apis/attendance';
import Track from './TrackAttendance';
import { Primary, Secondary } from '@utils/constant/color';
import { ITrackController } from './componentType';

const trackController: Record<MemberStack, ITrackController> = {
  pm: {
    title: '기획',
    arrayLength: 6,
    color: Primary.light,
    titleColor: Primary.default,
  },
  design: {
    title: '디자인',
    arrayLength: 6,
    color: '#FFF2EB',
    titleColor: Secondary.default,
  },
  frontend: {
    title: '프론트엔드',
    arrayLength: 12,
    color: '#ECFDE8',
    titleColor: '#36CA60',
  },
  backend: {
    title: '백엔드',
    arrayLength: 12,
    color: '#FDF3FF',
    titleColor: '#F33EA0',
  },
};

const EntireTrackAttendance = () => {
  const trackStacks = Object.keys(trackController) as MemberStack[];
<<<<<<< HEAD
  const { data, isLoading } = useQuery<TodayAttendanceListData>(['getAttendanceList'], getAttendanceList);
=======
  const { data, isLoading } = useQuery<AttendanceListData>(['getAttendanceList'], getAttendanceList);
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

  if (isLoading) return <div>로딩중</div>;

  return (
    <>
      {trackStacks.map((track, index) => (
        <Track track={trackController[track]} key={index} trackData={data![track]} />
      ))}
    </>
  );
};

export default EntireTrackAttendance;
