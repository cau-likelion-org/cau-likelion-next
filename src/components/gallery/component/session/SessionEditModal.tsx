import { useMutation } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import { deleteSession, updateSession } from 'src/apis/session';
import PostUploadModal, { PostUploadModalSubmitValues } from './PostUploadModal';

interface SessionEditModalProps {
  id: number;
  initialValues: {
    title: string;
    content: string;
    generation: string;
    category: string;
    week: string;
    date: string;
    imageUrls: string[];
    thumbnailUrl?: string;
  };
  onClose: () => void;
  onDeleteSuccess: () => void;
  onSubmitSuccess: () => void;
}

const SessionEditModal = ({ id, initialValues, onClose, onDeleteSuccess, onSubmitSuccess }: SessionEditModalProps) => {
  const tokenState = useTokenStore((state) => state.token);
  const updateMutation = useMutation({
    mutationFn: (values: PostUploadModalSubmitValues) =>
      updateSession(tokenState, id, {
        partName: values.category,
        generationNumber: Number(values.generation),
        title: values.title,
        description: values.content,
        sessionDate: `${values.date}T00:00:00`,
        degree: Number(values.week),
        thumbnailUrl: values.thumbnailUrl,
        imageUrls: values.imageUrls,
      }),
  });
  const deleteMutation = useMutation({ mutationFn: () => deleteSession(tokenState, id) });

  const handleSubmit = async (values: PostUploadModalSubmitValues) => {
    await updateMutation.mutateAsync(values);
    onSubmitSuccess();
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    onDeleteSuccess();
  };

  return (
    <PostUploadModal
      mode="edit"
      onClose={onClose}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      postType="session"
      category={{ label: '파트 구분', options: [] }}
      showWeekField
      dateFieldLabel="세션 일자"
      dateMode="single"
      initialValues={initialValues}
    />
  );
};

export default SessionEditModal;
