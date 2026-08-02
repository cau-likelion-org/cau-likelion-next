import PostUploadModal from './PostUploadModal';

interface HistoryEditModalProps {
  initialValues: {
    title: string;
    content: string;
    generation: string;
    dateRange: [string, string];
  };
  onClose: () => void;
  onDelete: () => void;
  onSubmit?: () => void;
}

const HistoryEditModal = ({ initialValues, onClose, onDelete, onSubmit }: HistoryEditModalProps) => (
  <PostUploadModal
    mode="edit"
    onClose={onClose}
    onDelete={onDelete}
    onSubmit={onSubmit}
    postType="gallery"
    dateFieldLabel="기간"
    dateMode="range"
    initialValues={{
      title: initialValues.title,
      content: initialValues.content,
      generation: initialValues.generation,
      dateRange: initialValues.dateRange,
    }}
  />
);

export default HistoryEditModal;
