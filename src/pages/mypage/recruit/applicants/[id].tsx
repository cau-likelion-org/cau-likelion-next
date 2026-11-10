import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import EmptyState from '@common/emptyState/EmptyState';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import ApplicantDetailView from '@mypage/recruit/ApplicantDetailView';
import { getApplicant } from '@mypage/recruit/applicantMock';
import useRoleGuard from 'src/apis/useRoleGuard';
import { canDeleteApplication, canManageRecruit } from '@utils/index';

const MyPageRecruitApplicantDetail = () => {
  const router = useRouter();
  const applicantId = Number(router.query.id);

  const { userProfile, isAuthorized, isUserProfileError } = useRoleGuard(canManageRecruit);

  const applicantQuery = useQuery({
    queryKey: ['recruitApplicant', applicantId],
    queryFn: () => getApplicant(applicantId),
    enabled: isAuthorized && router.isReady,
  });

  if (!isAuthorized || applicantQuery.isPending) return <PageLoadingGate isError={isUserProfileError} />;
  if (!applicantQuery.data) return <NotFound message="지원서를 찾을 수 없습니다." />;
  return (
    <ApplicantDetailView
      key={applicantQuery.data.id}
      applicant={applicantQuery.data}
      canDelete={!!userProfile && canDeleteApplication(userProfile.role)}
    />
  );
};

MyPageRecruitApplicantDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageRecruitApplicantDetail;

const NotFound = styled(EmptyState)`
  padding: 160px 0;
`;
