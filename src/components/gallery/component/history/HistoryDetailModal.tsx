import PostDetailModal from '../PostDetailModal';

interface HistoryDetailModalProps {
  title: string;
  badges: string[];
  description: string;
  date: [string, string];
  imageUrls: string[];
  onClose: () => void;
  onEdit?: () => void;
}

const HistoryDetailModal = ({
  title,
  badges,
  description,
  date,
  imageUrls,
  onClose,
  onEdit,
}: HistoryDetailModalProps) => (
  <PostDetailModal
    title={title}
    headerTitle="갤러리 목록으로 돌아가기"
    badges={badges}
    description={description}
    date={date}
    imageUrls={imageUrls}
    onEdit={onEdit}
    onClose={onClose}
  />
);

export default HistoryDetailModal;
