import { TodayAttendanceListData } from '@@types/request';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { token } from '@utils/state';
import { getAuthAxios } from '../authAxios';
import { toDateString } from '@utils/index';
import { AxiosResponse } from 'axios';

const useAttendanceList = () => {
  const tokens = useRecoilValue(token);
  const authAxios = getAuthAxios(tokens);

  const getAttendanceList = async () => {
    const response = await authAxios.get<AxiosResponse<TodayAttendanceListData>>(`/api/attendance/list`, {
      params: {
        date: toDateString(),
      },
    });
    return response.data.data;
  };

  const { data, isLoading } = useQuery<TodayAttendanceListData>(['attendanceList'], getAttendanceList);

  return { attendanceList: data, isLoading };
};

export default useAttendanceList;
