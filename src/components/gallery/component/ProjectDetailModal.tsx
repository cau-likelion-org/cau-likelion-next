import PostDetailModal from './PostDetailModal';

interface ProjectDetailModalProps {
  title: string;
  badges: string[];
  description: string;
  date: [string, string];
  onClose: () => void;
  onEdit: () => void;
}

const ProjectDetailModal = ({ title, badges, description, date, onClose, onEdit }: ProjectDetailModalProps) => (
  <PostDetailModal
    title={title}
    badges={badges}
    description={description}
    date={date}
    onEdit={onEdit}
    onClose={onClose}
  />
);

export default ProjectDetailModal;
