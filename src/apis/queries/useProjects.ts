import { ArchivingArrayType, IProjectData } from '@@types/request';
import { useQuery } from 'react-query';
import { getProjects } from '../project';

const useProjects = () => {
  const { data, isLoading } = useQuery<ArchivingArrayType<IProjectData>>(['projects'], getProjects);

  return { projects: data, isLoading };
};

export default useProjects;
