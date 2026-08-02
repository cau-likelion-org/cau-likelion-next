import PostUploadModal from './PostUploadModal';
import { TRACK_OPTIONS } from '@utils/constant';

interface SessionUploadModalProps {
  onClose: () => void;
  onSubmit?: () => void;
}

const SessionUploadModal = ({ onClose, onSubmit }: SessionUploadModalProps) => (
  <PostUploadModal
    onClose={onClose}
    onSubmit={onSubmit}
    postType="session"
    category={{ label: '파트 구분', options: TRACK_OPTIONS }}
    showWeekField
    dateFieldLabel="세션 일자"
    dateMode="single"
  />
);

export default SessionUploadModal;
