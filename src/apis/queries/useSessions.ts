import { ArchivingArrayType, ISessionData } from '@@types/request';
import { useQuery } from 'react-query';
import { getSessions } from '../session';

const useSessions = () => {
  const { data, isLoading } = useQuery<ArchivingArrayType<ISessionData>>(['sessionData'], getSessions);

  return { sessions: data, isLoading };
};

export default useSessions;
