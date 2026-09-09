import { useMutation, useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import { createGalleryProject, GALLERY_PROJECT_CATEGORY_LABEL, GalleryProjectCategory } from 'src/apis/gallery';
import { getGenerations } from 'src/apis/project';
import PostUploadModal, { PostUploadModalSubmitValues } from '../PostUploadModal';

const CATEGORY_OPTIONS = Object.values(GALLERY_PROJECT_CATEGORY_LABEL);
const CATEGORY_BY_LABEL = Object.fromEntries(
  Object.entries(GALLERY_PROJECT_CATEGORY_LABEL).map(([category, label]) => [
    label,
    category as GalleryProjectCategory,
  ]),
);

interface ProjectUploadModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const ProjectUploadModal = ({ onClose, onSuccess }: ProjectUploadModalProps) => {
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
      const category = CATEGORY_BY_LABEL[values.category ?? ''];
      if (!category) throw new Error('프로젝트 구분을 선택해 주세요.');
      return createGalleryProject(tokenState, {
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

  const handleSubmit = async (values: PostUploadModalSubmitValues) => {
    await createMutation.mutateAsync(values);
    onSuccess?.();
  };

  return (
    <PostUploadModal
      onClose={onClose}
      onSubmit={handleSubmit}
      postType="project"
      category={{ label: '프로젝트 구분', options: CATEGORY_OPTIONS }}
      dateFieldLabel="기간"
      dateMode="range"
    />
  );
};

export default ProjectUploadModal;
