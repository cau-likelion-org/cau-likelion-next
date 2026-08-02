import PostUploadModal from './PostUploadModal';
import { TRACK_OPTIONS } from '@utils/constant';

interface SessionEditModalProps {
  initialValues: {
    title: string;
    content: string;
    generation: string;
    category: string;
    week: string;
    date: string;
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
    category={{ label: '파트 구분', options: TRACK_OPTIONS }}
    showWeekField
    dateFieldLabel="세션 일자"
    dateMode="single"
    initialValues={{
      title: initialValues.title,
      content: initialValues.content,
      generation: initialValues.generation,
      category: initialValues.category,
      week: initialValues.week,
      date: initialValues.date,
    }}
  />
);

export default SessionEditModal;
