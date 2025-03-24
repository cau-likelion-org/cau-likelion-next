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
  pm_design: {
    title: '기획디자인',
    arrayLength: 10,
    color: Primary.light,
    titleColor: '#1627b0',
  },
  frontend: {
    title: '프론트엔드',
    arrayLength: 10,
    color: '#ECFDE8',
    titleColor: '#36c25d',
  },
  backend: {
    title: '백엔드',
    arrayLength: 10,
    color: '#FDF3FF',
    titleColor: '#ef3893',
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
