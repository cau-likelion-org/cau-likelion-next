import { useMutation, useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import { deleteHistory, updateHistory } from 'src/apis/history';
import { getGenerations } from 'src/apis/project';
import PostUploadModal, { PostUploadModalSubmitValues } from './PostUploadModal';

interface HistoryEditModalProps {
  id: number;
  initialValues: {
    title: string;
    content: string;
    generation: string;
    dateRange: [string, string];
    imageUrls: string[];
    thumbnailUrl?: string;
  };
  onClose: () => void;
  onDeleteSuccess: () => void;
  onSubmitSuccess: () => void;
}

const HistoryEditModal = ({ id, initialValues, onClose, onDeleteSuccess, onSubmitSuccess }: HistoryEditModalProps) => {
  const tokenState = useTokenStore((state) => state.token);
  const { data: generations } = useQuery({
    queryKey: ['generations'],
    queryFn: () => getGenerations(tokenState),
    enabled: !!tokenState.access,
  });
  const updateMutation = useMutation({
    mutationFn: (values: PostUploadModalSubmitValues) => {
      const generationId = generations?.find((g) => g.number === Number(values.generation))?.id;
      if (!generationId) throw new Error('존재하지 않는 기수예요.');
      return updateHistory(tokenState, id, {
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
  const deleteMutation = useMutation({ mutationFn: () => deleteHistory(tokenState, id) });

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
      postType="gallery"
      dateFieldLabel="기간"
      dateMode="range"
      initialValues={initialValues}
    />
  );
};

export default HistoryEditModal;
