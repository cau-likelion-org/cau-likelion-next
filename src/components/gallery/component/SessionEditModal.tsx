import PostUploadModal from './PostUploadModal';

const TRACK_OPTIONS = ['기획디자인', '프론트엔드', '백엔드'];
const CONTENT = '예시)이 서비스는 ~~한 서비스입니다\n서비스의 핵심기능\n\n· 이런거\n· 이\n· 이';

interface SessionEditModalProps {
  initialValues: {
    title: string;
    generation: string;
    category: string;
    week: string;
  };
  onClose: () => void;
  onDelete: () => void;
  onSubmit?: () => void;
}

const SessionEditModal = ({ initialValues, onClose, onDelete, onSubmit }: SessionEditModalProps) => (
  <PostUploadModal
    mode="edit"
    onClose={onClose}
    onDelete={onDelete}
    onSubmit={onSubmit}
    postType="session"
    categoryLabel="파트 구분"
    categoryOptions={TRACK_OPTIONS}
    showWeekField
    dateFieldLabel="세션 일자"
    dateMode="single"
    initialValues={{
      title: initialValues.title,
      content: CONTENT,
      generation: initialValues.generation,
      category: initialValues.category,
      week: initialValues.week,
      date: '2026-12-12',
    }}
  />
);

export default SessionEditModal;
