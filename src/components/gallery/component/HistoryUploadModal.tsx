import PostUploadModal from './PostUploadModal';

interface HistoryUploadModalProps {
  onClose: () => void;
  onSubmit?: () => void;
}

const HistoryUploadModal = ({ onClose, onSubmit }: HistoryUploadModalProps) => (
  <PostUploadModal onClose={onClose} onSubmit={onSubmit} postType="gallery" dateFieldLabel="기간" dateMode="range" />
);

export default HistoryUploadModal;
