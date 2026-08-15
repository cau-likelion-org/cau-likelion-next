import PostUploadModal from './PostUploadModal';
import { PROJECT_CATEGORY_OPTIONS } from '@utils/constant';

interface ProjectUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ProjectUploadModal = ({ onClose, onSuccess }: ProjectUploadModalProps) => (
  <PostUploadModal
    onClose={onClose}
    onSubmit={async () => onSuccess?.()}
    postType="project"
    category={{ label: '프로젝트 구분', options: PROJECT_CATEGORY_OPTIONS }}
    dateFieldLabel="프로젝트 기간"
    dateMode="range"
  />
);

export default ProjectUploadModal;
