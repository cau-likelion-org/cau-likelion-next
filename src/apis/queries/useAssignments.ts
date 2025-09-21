import { useQuery } from 'react-query';
import { getAssignments } from '../mypage';

const useAssignments = () => {
  const { data, isLoading, error } = useQuery(['userAssignment'], getAssignments);

  return { assignments: data, isLoading, error };
};

export default useAssignments;
