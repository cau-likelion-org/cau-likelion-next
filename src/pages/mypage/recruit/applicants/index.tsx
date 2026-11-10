import { ReactElement } from 'react';
import { useRouter } from 'next/router';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import MyPageShell from '@mypage/component/MyPageShell';
import ApplicantListSection from '@mypage/recruit/ApplicantListSection';
import useRoleGuard from 'src/apis/useRoleGuard';
import { canManageRecruit } from '@utils/index';

const MyPageRecruitApplicants = () => {
  const router = useRouter();

  const { isAuthorized, isUserProfileError } = useRoleGuard(canManageRecruit);

  if (!isAuthorized) return <PageLoadingGate isError={isUserProfileError} />;

  return (
    <>
      <ApplicantListSection />
      <ToastWrapper>
        <Toast
          variant="positive"
          text="지원서가 삭제되었습니다."
          show={router.query.deleted === 'true'}
          onHidden={() => router.replace('/mypage/recruit/applicants', undefined, { shallow: true })}
        />
      </ToastWrapper>
    </>
  );
};

MyPageRecruitApplicants.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="recruit-applicants">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageRecruitApplicants;
