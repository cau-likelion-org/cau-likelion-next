import styled from 'styled-components';

import Toast from '@common/toast/Toast';
import useRecruitModalStore from 'src/store/useRecruitModalStore';

import RecruitClosedAlert from './RecruitClosedAlert';
import RecruitNotifyModal from './RecruitNotifyModal';

// 지원하기 진입점(NavBar 등)이 페이지마다 있어도, 모달·토스트는 레이아웃과 무관하게
// 항상 랜딩 화면을 배경으로 떠야 해서 _app.tsx에서 이 컴포넌트 하나만 전역으로 마운트한다.
const RecruitModalRoot = () => {
  const step = useRecruitModalStore((state) => state.step);
  const openNotifyModal = useRecruitModalStore((state) => state.openNotifyModal);
  const closeModal = useRecruitModalStore((state) => state.close);
  const toast = useRecruitModalStore((state) => state.toast);
  const clearToast = useRecruitModalStore((state) => state.clearToast);

  return (
    <>
      {step === 'closedAlert' && <RecruitClosedAlert onClose={closeModal} onConfirm={openNotifyModal} />}
      {step === 'notify' && <RecruitNotifyModal onClose={closeModal} />}
      {toast && (
        <ToastWrapper>
          <Toast variant={toast.variant} text={toast.message} show={!!toast} onHidden={clearToast} />
        </ToastWrapper>
      )}
    </>
  );
};

export default RecruitModalRoot;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
