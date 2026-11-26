import { ReactElement } from 'react';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import ProjectUploadForm from '@project/upload/ProjectUploadForm';
import { isAdminRole } from '@utils/index';
import useRoleGuard from 'src/apis/useRoleGuard';

const ProjectUpload = () => {
  const { isAuthorized, isUserProfileError } = useRoleGuard(isAdminRole, {
    loginPath: '/project',
    forbiddenPath: '/project',
  });

  if (!isAuthorized) return <PageLoadingGate isError={isUserProfileError} />;

  return <ProjectUploadForm />;
};

ProjectUpload.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default ProjectUpload;
