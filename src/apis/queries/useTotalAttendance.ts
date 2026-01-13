import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { token, userScoreChanged } from '@utils/state';
import { getTotalAttendance } from '../mypage';

const useTotalAttendance = () => {
  const tokenValue = useRecoilValue(token);
  const scoreChanged = useRecoilValue(userScoreChanged);

  const { data, isLoading, error } = useQuery(['userAttendance', scoreChanged], () => getTotalAttendance(tokenValue));

  return { totalAttendance: data, isLoading, error };
};

export default useTotalAttendance;
