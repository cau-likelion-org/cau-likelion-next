import PostDetailModal from './PostDetailModal';

interface HistoryDetailModalProps {
  title: string;
  badges: string[];
  description: string;
  date: [string, string];
  onClose: () => void;
  onEdit: () => void;
}

const HistoryDetailModal = ({ title, badges, description, date, onClose, onEdit }: HistoryDetailModalProps) => (
  <PostDetailModal
    title={title}
    headerTitle="추억 상세보기"
    badges={badges}
    description={description}
    date={date}
    onEdit={onEdit}
    onClose={onClose}
  />
);

export default HistoryDetailModal;
