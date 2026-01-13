import { UserAttendance } from '@@types/request';
import { token } from '@utils/state';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { AxiosResponse } from 'axios';
import { getAuthAxios } from '../authAxios';

const useUserAttendance = () => {
  const tokenValue = useRecoilValue(token);
  const authAxios = getAuthAxios(tokenValue);

  const getUserAttendance = async () => {
    const response = await authAxios.get<AxiosResponse<UserAttendance>>(`/api/mypage/attendance`);
    return response.data.data;
  };

  const { data, isLoading } = useQuery<UserAttendance>(['userAttendance'], getUserAttendance, {
    enabled: !!tokenValue.access,
  });

  return { userAttendance: data, isLoading };
};

export default useUserAttendance;
