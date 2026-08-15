import { useMutation, useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import {
  deleteGalleryProject,
  updateGalleryProject,
  GALLERY_PROJECT_CATEGORY_LABEL,
  GalleryProjectCategory,
} from 'src/apis/gallery';
import { getGenerations } from 'src/apis/project';
import PostUploadModal, { PostUploadModalSubmitValues } from './PostUploadModal';

const CATEGORY_OPTIONS = Object.values(GALLERY_PROJECT_CATEGORY_LABEL);
const CATEGORY_BY_LABEL = Object.fromEntries(
  Object.entries(GALLERY_PROJECT_CATEGORY_LABEL).map(([category, label]) => [
    label,
    category as GalleryProjectCategory,
  ]),
);

interface ProjectEditModalProps {
  id: number;
  initialValues: {
    title: string;
    content: string;
    generation: string;
    category: string;
    dateRange: [string, string];
    imageUrls: string[];
    thumbnailUrl?: string;
  };
  onClose: () => void;
  onDeleteSuccess: () => void;
  onSubmitSuccess: () => void;
}

const ProjectEditModal = ({ id, initialValues, onClose, onDeleteSuccess, onSubmitSuccess }: ProjectEditModalProps) => {
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
      const category = CATEGORY_BY_LABEL[values.category ?? ''];
      if (!category) throw new Error('프로젝트 구분을 선택해 주세요.');
      return updateGalleryProject(tokenState, id, {
        generationId,
        category,
        title: values.title,
        description: values.content,
        startDate: values.dateRange?.[0] as string,
        endDate: values.dateRange?.[1] || undefined,
        thumbnailUrl: values.thumbnailUrl,
        imageUrls: values.imageUrls,
      });
    },
  });
  const deleteMutation = useMutation({ mutationFn: () => deleteGalleryProject(tokenState, id) });

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
      postType="project"
      category={{ label: '프로젝트 구분', options: CATEGORY_OPTIONS }}
      dateFieldLabel="프로젝트 기간"
      dateMode="range"
      initialValues={initialValues}
    />
  );
};

export default ProjectEditModal;
