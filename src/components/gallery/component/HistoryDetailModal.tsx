import PostDetailModal from './PostDetailModal';

const DESCRIPTION =
  '서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명';

interface HistoryDetailModalProps {
  title: string;
  badges: string[];
  onClose: () => void;
}

const HistoryDetailModal = ({ title, badges, onClose }: HistoryDetailModalProps) => (
  <PostDetailModal
    title={title}
    badges={badges}
    description={DESCRIPTION}
    date={['2026/12/12', '2026/12/12']}
    onEdit={() => {}}
    onClose={onClose}
  />
);

export default HistoryDetailModal;
