import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

import { UserProfile } from '@@types/request';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';

export const USER_PROFILE_QUERY_KEY = ['userProfile'];

const MAX_RETRY_COUNT = 3;

export const shouldRetryUserProfile = (failureCount: number, error: unknown) => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status === 401 || status === 403) return false;
  return failureCount < MAX_RETRY_COUNT;
};

const useUserProfile = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const tokenState = useTokenStore((state) => state.token);

  return useQuery<UserProfile, AxiosError>({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: () => getUserProfile(useTokenStore.getState().token),
    retry: shouldRetryUserProfile,
    enabled: enabled && !!tokenState.access,
  });
};

export default useUserProfile;
