import PostUploadModal from './PostUploadModal';

const CONTENT = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

interface HistoryEditModalProps {
  initialValues: {
    title: string;
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
    dateFieldLabel="활동 기간"
    dateMode="range"
    initialValues={{
      title: initialValues.title,
      content: CONTENT,
      generation: initialValues.generation,
      dateRange: initialValues.dateRange,
    }}
  />
);

export default HistoryEditModal;
