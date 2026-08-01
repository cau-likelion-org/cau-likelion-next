import PostUploadModal from './PostUploadModal';

const HistoryUploadModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit?: () => void }) => (
  <PostUploadModal
    onClose={onClose}
    onSubmit={onSubmit}
    postType="gallery"
    dateFieldLabel="활동 기간"
    dateMode="range"
  />
);

export default HistoryUploadModal;
