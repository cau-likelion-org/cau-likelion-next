import PostDetailModal from './PostDetailModal';

const DESCRIPTION =
  '서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명';

interface SessionDetailModalProps {
  title: string;
  badges: string[];
  onClose: () => void;
}

const SessionDetailModal = ({ title, badges, onClose }: SessionDetailModalProps) => (
  <PostDetailModal
    title={title}
    badges={badges}
    description={DESCRIPTION}
    date="2026/12/12"
    onEdit={() => {}}
    onClose={onClose}
  />
);

export default SessionDetailModal;
