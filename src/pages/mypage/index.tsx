import { ReactElement, useState } from 'react';
import useLoginRequired from 'src/hooks/useLoginRequired';
import { INACTIVE_MEMBER_NOTICE_KEY } from '@utils/constant';
import { canCreateAttendance, isAdminRole, isAttendanceTarget } from '@utils/role';
import styled from 'styled-components';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import MyPageShell from '@mypage/component/MyPageShell';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import ProfileCard from '@mypage/component/home/ProfileCard';
import AttendanceCheckCard from '@mypage/component/home/AttendanceCheckCard';
import MakeAttendanceCard from '@mypage/component/home/MakeAttendanceCard';
import MyScoreSection from '@mypage/component/home/MyScoreSection';
import MemberScoreSection from '@mypage/component/home/MemberScoreSection';
import { media } from '@utils/constant/breakpoint';
import useUserProfile from 'src/apis/useUserProfile';
import useSessionFlash from 'src/hooks/useSessionFlash';

const MyPage = () => {
  const { data: userProfile, isError: isUserProfileError } = useUserProfile();

  useLoginRequired();

  // 활동 전용 메뉴에서 돌려보내진 경우에만 안내 (홈 자체 진입에는 띄우지 않는다)
  const [toastMessage, setToastMessage] = useState('');
  useSessionFlash(INACTIVE_MEMBER_NOTICE_KEY, () => setToastMessage('현재 활동 중인 구성원이 아닙니다.'));

  return (
    <>
      <ToastWrapper>
        <Toast variant="negative" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {!userProfile ? (
        <PageLoadingGate isError={isUserProfileError} />
      ) : (
        <>
          <CardRow>
            <ProfileCard user={userProfile} />
            {canCreateAttendance(userProfile.role) ? (
              <MakeAttendanceCard />
            ) : (
              <AttendanceCheckCard isTarget={isAttendanceTarget(userProfile.role)} />
            )}
          </CardRow>
          {isAdminRole(userProfile.role) ? (
            <MemberScoreSection userProfile={userProfile} />
          ) : (
            <MyScoreSection userProfile={userProfile} />
          )}
        </>
      )}
    </>
  );
};

MyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="home">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPage;

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  width: 100%;

  ${media.lg} {
    flex-direction: row;
    align-items: center;
  }
`;
