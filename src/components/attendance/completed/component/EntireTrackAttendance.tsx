import { useQuery } from 'react-query';
import { TodayAttendanceListData, MemberStack, MemberStackKor } from '@@types/request';

import { getAttendanceList } from 'src/apis/attendance';
import Track from './TrackAttendance';
import { Primary, Secondary } from '@utils/constant/color';
import { ITrackController } from './componentType';
import Loading from '@common/loading/Loading';
import { token } from '@utils/state';
import { useRecoilValue } from 'recoil';

const trackController: Record<MemberStack, ITrackController> = {
  pm: {
    title: '기획',
    arrayLength: 4,
    color: Primary.light,
    titleColor: Primary.default,
  },
  design: {
    title: '디자인',
    arrayLength: 5,
    color: '#FFF2EB',
    titleColor: Secondary.default,
  },
  frontend: {
    title: '프론트엔드',
    arrayLength: 9,
    color: '#ECFDE8',
    titleColor: '#36CA60',
  },
  backend: {
    title: '백엔드',
    arrayLength: 10,
    color: '#FDF3FF',
    titleColor: '#F33EA0',
  },
};

const EntireTrackAttendance = () => {
  const trackStacks = Object.keys(trackController) as MemberStack[];
  const tokens = useRecoilValue(token);
  const { data, isLoading } = useQuery<TodayAttendanceListData>(['getAttendanceList'], () => getAttendanceList(tokens));

  if (isLoading) return <Loading />;

  return (
    <>
      {trackStacks.map((track, index) => (
        <Track track={trackController[track]} key={index} trackData={data![track]} />
      ))}
    </>
  );
};

export default EntireTrackAttendance;
