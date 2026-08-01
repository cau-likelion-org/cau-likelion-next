import PostUploadModal from './PostUploadModal';

const CATEGORY_OPTIONS = ['아이디어톤', '해커톤', '중커톤'];
const CONTENT = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

interface ProjectEditModalProps {
  initialValues: {
    title: string;
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
    categoryLabel="프로젝트 구분"
    categoryOptions={CATEGORY_OPTIONS}
    dateFieldLabel="프로젝트 기간"
    dateMode="range"
    initialValues={{
      title: initialValues.title,
      content: CONTENT,
      generation: initialValues.generation,
      category: initialValues.category,
      dateRange: initialValues.dateRange,
    }}
  />
);

export default ProjectEditModal;
