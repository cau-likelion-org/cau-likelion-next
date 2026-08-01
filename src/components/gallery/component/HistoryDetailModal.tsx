import PostDetailModal from './PostDetailModal';

const DESCRIPTION =
  '서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명';

interface HistoryDetailModalProps {
  title: string;
  badges: string[];
  onClose: () => void;
  onEdit: () => void;
}

const HistoryDetailModal = ({ title, badges, onClose, onEdit }: HistoryDetailModalProps) => (
  <PostDetailModal
    title={title}
    badges={badges}
    description={DESCRIPTION}
    date={['2026/12/12', '2026/12/12']}
    onEdit={onEdit}
    onClose={onClose}
  />
);

export default HistoryDetailModal;
