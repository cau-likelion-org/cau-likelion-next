import { TodayAttendanceData } from '@@types/request';
import { AxiosError, AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { getAuthAxios } from '../authAxios';
import { token } from '@utils/state';
import { useRecoilValue } from 'recoil';
import { toDateString } from '@utils/index';
import { useRouter } from 'next/router';

const useAttendance = () => {
  const tokens = useRecoilValue(token);
  const authAxios = getAuthAxios(tokens);
  const router = useRouter();

  const getAttendance = async () => {
    const response = await authAxios.get<AxiosResponse<TodayAttendanceData>>(`/api/attendance`, {
      params: {
        date: toDateString(),
      },
    });
    return response.data.data;
  };

  const { data, isLoading } = useQuery<TodayAttendanceData, AxiosError>(['attendance'], getAttendance, {
    retry: false,
    onError: (error) => {
      if (error.response?.status == 400) {
        alert('출석 가능일이 아닙니다!');
        router.push('/');
      }
      if (error.response?.status == 405) {
        router.push('/attendance/completed');
      }
      if (error.response?.status == 406) {
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

  return { attendance: data, isLoading };
};

export default useAttendance;
