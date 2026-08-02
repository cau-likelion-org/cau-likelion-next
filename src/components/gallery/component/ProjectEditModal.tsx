import PostUploadModal from './PostUploadModal';
import { CATEGORY_OPTIONS } from './constants';

interface ProjectEditModalProps {
  initialValues: {
    title: string;
    content: string;
    generation: string;
    category: string;
    dateRange: [string, string];
  };
  onClose: () => void;
  onDelete: () => void;
  onSubmit?: () => void;
}

const ProjectEditModal = ({ initialValues, onClose, onDelete, onSubmit }: ProjectEditModalProps) => (
  <PostUploadModal
    mode="edit"
    onClose={onClose}
    onDelete={onDelete}
    onSubmit={onSubmit}
    postType="project"
    category={{ label: '프로젝트 구분', options: CATEGORY_OPTIONS }}
    dateFieldLabel="프로젝트 기간"
    dateMode="range"
    initialValues={{
      title: initialValues.title,
      content: initialValues.content,
      generation: initialValues.generation,
      category: initialValues.category,
      dateRange: initialValues.dateRange,
    }}
  />
);

export default ProjectEditModal;
