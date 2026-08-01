import PostUploadModal from './PostUploadModal';

const CATEGORY_OPTIONS = ['아이디어톤', '해커톤', '중커톤'];

const ProjectUploadModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit?: () => void }) => (
  <PostUploadModal
    onClose={onClose}
    onSubmit={onSubmit}
    postType="project"
    categoryLabel="프로젝트 구분"
    categoryOptions={CATEGORY_OPTIONS}
    dateFieldLabel="프로젝트 기간"
    dateMode="range"
  />
);

export default ProjectUploadModal;
