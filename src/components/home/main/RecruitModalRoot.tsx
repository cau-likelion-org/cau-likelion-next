import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import Toast from '@common/toast/Toast';
import useRecruitModalStore from 'src/store/useRecruitModalStore';
import { MOBILE } from '@home/common/responsive';

// _app에서 모든 페이지에 항상 마운트되므로, step이 바뀌었을 때만 받는다
const RecruitClosedAlert = dynamic(() => import('./RecruitClosedAlert'), { ssr: false });
const RecruitNotifyModal = dynamic(() => import('./RecruitNotifyModal'), { ssr: false });

// 2단계(notify)로 넘어갈 때만 랜딩 화면으로 이동한다.
const RecruitModalRoot = () => {
  const router = useRouter();
  const step = useRecruitModalStore((state) => state.step);
  const openNotifyModal = useRecruitModalStore((state) => state.openNotifyModal);
  const closeModal = useRecruitModalStore((state) => state.close);
  const toast = useRecruitModalStore((state) => state.toast);
  const clearToast = useRecruitModalStore((state) => state.clearToast);

  const handleConfirmNotify = () => {
    if (router.pathname !== '/') router.push('/');
    openNotifyModal();
  };

  return (
    <>
      {step === 'closedAlert' && <RecruitClosedAlert onClose={closeModal} onConfirm={handleConfirmNotify} />}
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

  @media (max-width: ${MOBILE}px) {
    top: 36px;
  }
`;
