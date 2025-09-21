import { useQuery } from 'react-query';
import { getAssignments } from '../mypage';
import { UserProfile } from '@@types/request';

interface Params {
  userProfile: UserProfile | null;
}

const useUserAssignment = ({ userProfile }: Params) => {
  const { data, isLoading, error } = useQuery(
    ['userAssignment'],
    () => getAssignments().then((data) => data.filter((user: any) => user['이름'] == userProfile!.name)),
    {
      enabled: !!userProfile,
    },
  );

  return { userAssignment: data, isLoading, error };
};

export default useUserAssignment;
