import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ISessionDetail } from '@@types/request';
import { getSessionDetail } from '../session';
import { getIdFromAsPath } from '@utils/index';

const useSessionDetail = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery<ISessionDetail>(['sessionDetail', router.query.session_id], () =>
    getSessionDetail(getIdFromAsPath(router.asPath, 'session')),
  );

  return { sessionDetail: data, isLoading };
};

export default useSessionDetail;
