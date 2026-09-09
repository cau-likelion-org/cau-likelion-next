import { useMutation, useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import { createHistory } from 'src/apis/history';
import { getGenerations } from 'src/apis/project';
import PostUploadModal, { PostUploadModalSubmitValues } from '../PostUploadModal';

interface HistoryUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const HistoryUploadModal = ({ onClose, onSuccess }: HistoryUploadModalProps) => {
  const tokenState = useTokenStore((state) => state.token);
  const { data: generations } = useQuery({
    queryKey: ['generations'],
    queryFn: () => getGenerations(tokenState),
    enabled: !!tokenState.access,
  });
  const createMutation = useMutation({
    mutationFn: (values: PostUploadModalSubmitValues) => {
      const generationId = generations?.find((g) => g.number === Number(values.generation))?.id;
      if (!generationId) throw new Error('존재하지 않는 기수예요.');
      return createHistory(tokenState, {
        generationId,
        title: values.title,
        description: values.content,
        startDate: values.dateRange?.[0] as string,
        endDate: values.dateRange?.[1] || undefined,
        thumbnailUrl: values.thumbnailUrl,
        imageUrls: values.imageUrls,
      });
    },
  });

  const handleSubmit = async (values: PostUploadModalSubmitValues) => {
    await createMutation.mutateAsync(values);
    onSuccess?.();
  };

  return (
    <PostUploadModal
      onClose={onClose}
      onSubmit={handleSubmit}
      postType="gallery"
      dateFieldLabel="기간"
      dateMode="range"
    />
  );
};

export default HistoryUploadModal;
