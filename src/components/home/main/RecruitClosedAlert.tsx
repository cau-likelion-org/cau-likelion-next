import Button from '@common/button/Button';
import Modal, { ModalActions, ModalInformation, ModalTitle } from '@common/modal/Modal';

export interface RecruitClosedAlertProps {
  onClose: () => void;
  onConfirm: () => void;
}

const RecruitClosedAlert = ({ onClose, onConfirm }: RecruitClosedAlertProps) => (
  <Modal size="medium" ariaLabel="아직 지원 기간이 아닙니다. 리크루팅 사전 알림 신청을 하시겠습니까?" onClose={onClose}>
    <ModalInformation>
      <ModalTitle>
        아직 지원 기간이 아닙니다.
        <br />
        리크루팅 사전 알림 신청을 하시겠습니까?
      </ModalTitle>
    </ModalInformation>
    <ModalActions>
      <Button variant="outlined" color="assistive" size="medium" onClick={onClose}>
        취소
      </Button>
      <Button variant="solid" color="primary" size="medium" onClick={onConfirm}>
        사전알림 신청하기
      </Button>
    </ModalActions>
  </Modal>
);

export default RecruitClosedAlert;
