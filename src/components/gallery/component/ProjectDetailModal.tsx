import PostDetailModal from './PostDetailModal';

const DESCRIPTION =
  '서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명 서비스설명';

interface ProjectDetailModalProps {
  title: string;
  badges: string[];
  onClose: () => void;
  onEdit: () => void;
}

const ProjectDetailModal = ({ title, badges, onClose, onEdit }: ProjectDetailModalProps) => (
  <PostDetailModal
    title={title}
    badges={badges}
    description={DESCRIPTION}
    date={['2026/12/12', '2026/12/12']}
    onEdit={onEdit}
    onClose={onClose}
  />
);

export default ProjectDetailModal;
