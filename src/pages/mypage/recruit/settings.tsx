import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import Tab from '@common/tab/Tab';
import Toast from '@common/toast/Toast';
import EmptyState from '@common/emptyState/EmptyState';
import GenerationSettingSection from '@mypage/recruit/GenerationSettingSection';
import { RECRUIT_GENERATION_SETTING_MOCK } from '@mypage/recruit/mock';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';

const TAB_ITEMS = [
  { key: 'generation', label: '기수 설정' },
  { key: 'notice', label: '모집 공고' },
  { key: 'first-questions', label: '1단계 문항' },
  { key: 'second-questions', label: '2단계 문항' },
];

const MyPageRecruitSettings = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile, isError: isUserProfileError } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !isAdminRole(userProfile.role)) router.push('/mypage');
  }, [userProfile, router]);

  const isAuthorized = !!userProfile && isAdminRole(userProfile.role);

  const [activeTab, setActiveTab] = useState(TAB_ITEMS[0].key);
  const [toastMessage, setToastMessage] = useState('');

  return (
    <>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {!isAuthorized ? (
        <PageLoadingGate isError={isUserProfileError} />
      ) : (
        <Wrapper>
          <Tab items={TAB_ITEMS} activeKey={activeTab} onChange={setActiveTab} size="large" />
          {activeTab === 'generation' ? (
            <GenerationSettingSection
              initialValues={RECRUIT_GENERATION_SETTING_MOCK}
              onSave={() => setToastMessage('변경사항이 저장되었습니다.')}
            />
          ) : (
            <EmptyState message="준비 중인 화면입니다." />
          )}
        </Wrapper>
      )}
    </>
  );
};

MyPageRecruitSettings.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFullWidth>
      <MyPageShell active="recruit-settings">{page}</MyPageShell>
    </LayoutFullWidth>
  );
};

export default MyPageRecruitSettings;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
