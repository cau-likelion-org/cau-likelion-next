import PostUploadModal from './PostUploadModal';

const HistoryUploadModal = ({ onClose }: { onClose: () => void }) => (
  <PostUploadModal onClose={onClose} postType="gallery" dateFieldLabel="활동 기간" dateMode="range" />
);

export default HistoryUploadModal;
