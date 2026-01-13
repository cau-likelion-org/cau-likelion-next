import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { IProjectDetail } from '@@types/request';
import { getProjectDetail } from '../project';
import { getIdFromAsPath } from '@utils/index';

const useProjectDetail = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery<IProjectDetail>(['projectDetail', router.query.project_id], () =>
    getProjectDetail(getIdFromAsPath(router.asPath, 'project')),
  );

  return { projectDetail: data, isLoading };
};

export default useProjectDetail;
