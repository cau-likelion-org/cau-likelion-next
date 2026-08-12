import { ReactElement, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import ProjectUploadForm from '@project/upload/ProjectUploadForm';
import { getUserProfile } from 'src/apis/account';
import { ProjectResponseDto, getProjectById } from 'src/apis/project';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';

const ProjectEdit = () => {
  const router = useRouter();
  const projectIdParam = router.query.project_id;
  const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam;

  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const { data: userProfile, isFetched } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const { data: project } = useQuery<ProjectResponseDto>({
    queryKey: ['projectDetail', projectId],
    queryFn: () => getProjectById(tokenState, Number(projectId)),
    enabled: !!projectId && !!tokenState.access,
  });

  useEffect(() => {
    if (!hasHydrated) return;
    if (!tokenState.access) {
      router.push('/project');
      return;
    }
    if (isFetched && !(userProfile && isAdminRole(userProfile.role))) {
      router.push('/project');
    }
  }, [hasHydrated, tokenState, isFetched, userProfile, router]);

  if (!userProfile || !isAdminRole(userProfile.role) || !project) return null;

  return <ProjectUploadForm mode="edit" initialData={project} />;
};

ProjectEdit.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default ProjectEdit;
