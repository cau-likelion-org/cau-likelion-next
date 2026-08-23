import { useMutation } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import { createSession } from 'src/apis/session';
import PostUploadModal, { PostUploadModalSubmitValues } from './PostUploadModal';

interface SessionUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const SessionUploadModal = ({ onClose, onSuccess }: SessionUploadModalProps) => {
  const tokenState = useTokenStore((state) => state.token);
  const createMutation = useMutation({
    mutationFn: (values: PostUploadModalSubmitValues) =>
      createSession(tokenState, {
        partName: values.category as string,
        generationNumber: Number(values.generation),
        title: values.title,
        description: values.content,
        sessionDate: `${values.date}T00:00:00`,
        degree: Number(values.week),
        thumbnailUrl: values.thumbnailUrl,
        imageUrls: values.imageUrls,
      }),
  });

  const handleSubmit = async (values: PostUploadModalSubmitValues) => {
    await createMutation.mutateAsync(values);
    onSuccess?.();
  };

  return (
    <PostUploadModal
      onClose={onClose}
      onSubmit={handleSubmit}
      postType="session"
      category={{ label: '파트 구분', options: [] }}
      showWeekField
      dateFieldLabel="세션 일자"
      dateMode="single"
    />
  );
};

export default SessionUploadModal;
