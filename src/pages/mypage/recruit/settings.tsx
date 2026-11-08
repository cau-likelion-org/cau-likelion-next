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
import { ToastWrapper } from '@common/toast/toastLayout';
import Alert from '@common/alert/Alert';
import GenerationSettingSection from '@mypage/recruit/GenerationSettingSection';
import NoticeSettingSection from '@mypage/recruit/NoticeSettingSection';
import FirstStepQuestionSection from '@mypage/recruit/FirstStepQuestionSection';
import SecondStepQuestionSection from '@mypage/recruit/SecondStepQuestionSection';
import {
  RECRUIT_GENERATION_SETTING_MOCK,
  RECRUIT_INTERVIEW_SETTING_MOCK,
  RECRUIT_SECOND_STEP_SETTING_MOCK,
  RECRUIT_NOTICE_SETTING_MOCK,
} from '@mypage/recruit/mock';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
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
  const [isNoticeDirty, setIsNoticeDirty] = useState(false);
  const { isConfirmOpen, requestLeave, confirmLeave, cancelLeave } = useLeaveGuard(isNoticeDirty);

  return (
    <>
      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      {!isAuthorized ? (
        <PageLoadingGate isError={isUserProfileError} />
      ) : (
        <Wrapper>
          <Tab
            items={TAB_ITEMS}
            activeKey={activeTab}
            onChange={(key) => requestLeave(() => setActiveTab(key))}
            size="large"
          />
          {activeTab === 'generation' ? (
            <GenerationSettingSection
              initialValues={RECRUIT_GENERATION_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '회차 설정이 저장되었습니다.')
              }
            />
          ) : activeTab === 'notice' ? (
            <NoticeSettingSection
              initialValues={RECRUIT_NOTICE_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '모집 공고가 저장되었습니다.')
              }
              onDirtyChange={setIsNoticeDirty}
            />
          ) : activeTab === 'first-questions' ? (
            <FirstStepQuestionSection
              initialValues={RECRUIT_INTERVIEW_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '1단계 문항이 저장되었습니다.')
              }
            />
          ) : (
            <SecondStepQuestionSection
              initialValues={RECRUIT_SECOND_STEP_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '2단계 문항이 저장되었습니다.')
              }
            />
          )}
        </Wrapper>
      )}
      {isConfirmOpen && (
        <Alert
          heading="저장하지 않고 나가면 작성한 내용이 사라집니다."
          onDimmerClick={cancelLeave}
          actions={[
            { label: '취소', variant: 'assistive', onClick: cancelLeave },
            { label: '나가기', variant: 'primary', onClick: confirmLeave },
          ]}
        />
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
