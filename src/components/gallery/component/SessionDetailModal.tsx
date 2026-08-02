import PostDetailModal from './PostDetailModal';

interface SessionDetailModalProps {
  title: string;
  badges: string[];
  description: string;
  date: string;
  onClose: () => void;
  onEdit: () => void;
}

const SessionDetailModal = ({ title, badges, description, date, onClose, onEdit }: SessionDetailModalProps) => (
  <PostDetailModal
    title={title}
    badges={badges}
    description={description}
    date={date}
    onEdit={onEdit}
    onClose={onClose}
  />
);

export default SessionDetailModal;
