import Alert from './Alert';

export interface LeaveConfirmAlertProps {
  heading?: string;
  body?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const LeaveConfirmAlert = ({
  heading = '저장하지 않고 나가면 작성한 내용이 사라집니다.',
  body,
  onCancel,
  onConfirm,
}: LeaveConfirmAlertProps) => (
  <Alert
    heading={heading}
    body={body}
    onDimmerClick={onCancel}
    actions={[
      { label: '취소', variant: 'assistive', onClick: onCancel },
      { label: '나가기', variant: 'primary', onClick: onConfirm },
    ]}
  />
);

export default LeaveConfirmAlert;
