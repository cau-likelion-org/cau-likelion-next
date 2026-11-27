import { ReactElement, useState } from 'react';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import Tab from '@common/tab/Tab';
import Toast from '@common/toast/Toast';
import { ToastWrapper } from '@common/toast/toastLayout';
import LeaveConfirmAlert from '@common/alert/LeaveConfirmAlert';
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
import useRoleGuard from 'src/apis/useRoleGuard';
import useLeaveGuard from 'src/hooks/useLeaveGuard';
import { canManageRecruit } from '@utils/role';

const TAB_ITEMS = [
  { key: 'generation', label: '기수 설정' },
  { key: 'notice', label: '모집 공고' },
  { key: 'first-questions', label: '1단계 문항' },
  { key: 'second-questions', label: '2단계 문항' },
];

const MyPageRecruitSettings = () => {
  const { isAuthorized, isUserProfileError } = useRoleGuard(canManageRecruit);

  const [activeTab, setActiveTab] = useState(TAB_ITEMS[0].key);
  const [toastMessage, setToastMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const { isConfirmOpen, requestLeave, confirmLeave, cancelLeave } = useLeaveGuard(isDirty);

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
              onDirtyChange={setIsDirty}
            />
          ) : activeTab === 'notice' ? (
            <NoticeSettingSection
              initialValues={RECRUIT_NOTICE_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '모집 공고가 저장되었습니다.')
              }
              onDirtyChange={setIsDirty}
            />
          ) : activeTab === 'first-questions' ? (
            <FirstStepQuestionSection
              initialValues={RECRUIT_INTERVIEW_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '1단계 문항이 저장되었습니다.')
              }
              onDirtyChange={setIsDirty}
            />
          ) : (
            <SecondStepQuestionSection
              initialValues={RECRUIT_SECOND_STEP_SETTING_MOCK}
              onSave={(_, isUpdate) =>
                setToastMessage(isUpdate ? '변경사항이 저장되었습니다.' : '2단계 문항이 저장되었습니다.')
              }
              onDirtyChange={setIsDirty}
            />
          )}
        </Wrapper>
      )}
      {isConfirmOpen && <LeaveConfirmAlert onCancel={cancelLeave} onConfirm={confirmLeave} />}
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
