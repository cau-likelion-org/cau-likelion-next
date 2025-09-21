import { token } from '@utils/state';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { getAuthAxios } from '../authAxios';
import { AxiosResponse } from 'axios';
import { UserProfile } from '@@types/request';

interface UserProfileResponse {
  user: UserProfile;
}

interface Params {
  enabled?: boolean;
  retry?: boolean;
}

const useUserProfile = (params: Params) => {
  const tokenState = useRecoilValue(token);
  const authAxios = getAuthAxios(tokenState);

  const getUserProfile = async () => {
    const response = await authAxios.get<AxiosResponse<UserProfileResponse>>(`/api/profile`);
    return response.data.data.user;
  };

  const { data, isLoading } = useQuery(['userProfile'], getUserProfile, params);

  return { userProfile: data, isLoading };
};

export default useUserProfile;
