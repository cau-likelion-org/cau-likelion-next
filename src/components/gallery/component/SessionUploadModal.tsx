import PostUploadModal from './PostUploadModal';

const TRACK_OPTIONS = ['기획디자인', '프론트엔드', '백엔드'];

const SessionUploadModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit?: () => void }) => (
  <PostUploadModal
    onClose={onClose}
    onSubmit={onSubmit}
    postType="session"
    categoryLabel="파트 구분"
    categoryOptions={TRACK_OPTIONS}
    showWeekField
    dateFieldLabel="세션 일자"
    dateMode="single"
  />
);

export default SessionUploadModal;
