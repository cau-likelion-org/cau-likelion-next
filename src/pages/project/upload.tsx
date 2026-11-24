import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import ProjectUploadForm from '@project/upload/ProjectUploadForm';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';
import useUserProfile from 'src/apis/useUserProfile';

const ProjectUpload = () => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const { data: userProfile, isFetched, isError: isUserProfileError } = useUserProfile();

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

  if (!userProfile || !isAdminRole(userProfile.role)) return <PageLoadingGate isError={isUserProfileError} />;

  return <ProjectUploadForm />;
};

ProjectUpload.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default ProjectUpload;
