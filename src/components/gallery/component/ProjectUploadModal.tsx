import PostUploadModal from './PostUploadModal';
import { CATEGORY_OPTIONS } from './constants';

interface ProjectUploadModalProps {
  onClose: () => void;
  onSubmit?: () => void;
}

const ProjectUploadModal = ({ onClose, onSubmit }: ProjectUploadModalProps) => (
  <PostUploadModal
    onClose={onClose}
    onSubmit={onSubmit}
    postType="project"
    category={{ label: '프로젝트 구분', options: CATEGORY_OPTIONS }}
    dateFieldLabel="프로젝트 기간"
    dateMode="range"
  />
);

export default ProjectUploadModal;
