import { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import ProjectUploadForm from '@project/upload/ProjectUploadForm';
import { ProjectResponseDto, getProjectById } from 'src/apis/project';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import useRoleGuard from 'src/apis/useRoleGuard';

const ProjectEdit = () => {
  const router = useRouter();
  const projectIdParam = router.query.project_id;
  const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam;

  const numericProjectId = Number(projectId);
  const isProjectIdValid = !!projectId && Number.isInteger(numericProjectId);

  const tokenState = useTokenStore((state) => state.token);
  const { isAuthorized, isUserProfileError } = useRoleGuard(isAdminRole, {
    loginPath: '/project',
    forbiddenPath: '/project',
  });

  const { data: project, isError: isProjectError } = useQuery<ProjectResponseDto>({
    queryKey: ['adminProject', numericProjectId],
    queryFn: () => getProjectById(tokenState, numericProjectId),
    enabled: isProjectIdValid && !!tokenState.access,
  });

  if (!isAuthorized || !project) return <PageLoadingGate isError={isUserProfileError || isProjectError} />;

  return <ProjectUploadForm mode="edit" initialData={project} />;
};

ProjectEdit.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default ProjectEdit;
