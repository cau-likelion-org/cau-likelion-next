import { ArchivingArrayType, IProjectData, UserProfile } from '@@types/request';
import Button from '@common/button/Button';
import CircularLoading from '@common/loading/CircularLoading';
import Toast from '@common/toast/Toast';
import IcAdd from '@assets/svg/ic-add.svg';
import { IcFailure } from '@assets/svg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserProfile } from 'src/apis/account';
import {
  PROJECT_CATEGORY_LABEL,
  PROJECT_CREATED_FLAG_KEY,
  PROJECT_DELETED_FLAG_KEY,
  PROJECT_UPDATED_FLAG_KEY,
  getProjects,
} from 'src/apis/project';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, sortArchivingListDesc } from '@utils/index';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';
import ProjectFilterSelect from './ProjectFilterSelect';

const ALL_OPTION = '전체';

const CATEGORY_OPTIONS = [ALL_OPTION, ...Object.values(PROJECT_CATEGORY_LABEL)];

const CATEGORY_PRIORITY: Record<string, number> = {
  중커톤: 0,
  해커톤: 1,
  아이디어톤: 2,
};
const getCategoryRank = (category: string) => CATEGORY_PRIORITY[category] ?? 3;

interface FlatProject extends IProjectData {
  generation: string;
}

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType<IProjectData> | null }) => {
  const { data, isLoading, isError } = useQuery<ArchivingArrayType<IProjectData>>({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: staticData ?? undefined,
  });

  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const [selectedGeneration, setSelectedGeneration] = useState(ALL_OPTION);
  const [selectedCategory, setSelectedCategory] = useState(ALL_OPTION);

  const [isDeletedToastOpen, setIsDeletedToastOpen] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(PROJECT_DELETED_FLAG_KEY) === 'true',
  );
  useEffect(() => {
    if (!isDeletedToastOpen) return;
    sessionStorage.removeItem(PROJECT_DELETED_FLAG_KEY);
  }, [isDeletedToastOpen]);

  const [isCreatedToastOpen, setIsCreatedToastOpen] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(PROJECT_CREATED_FLAG_KEY) === 'true',
  );
  useEffect(() => {
    if (!isCreatedToastOpen) return;
    sessionStorage.removeItem(PROJECT_CREATED_FLAG_KEY);
  }, [isCreatedToastOpen]);

  const [isUpdatedToastOpen, setIsUpdatedToastOpen] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(PROJECT_UPDATED_FLAG_KEY) === 'true',
  );
  useEffect(() => {
    if (!isUpdatedToastOpen) return;
    sessionStorage.removeItem(PROJECT_UPDATED_FLAG_KEY);
  }, [isUpdatedToastOpen]);

  const sortedGroups = useMemo(() => (data ? sortArchivingListDesc(data) : []), [data]);

  const flatProjects: FlatProject[] = useMemo(
    () => sortedGroups.flatMap(([generation, projects]) => projects.map((project) => ({ ...project, generation }))),
    [sortedGroups],
  );

  const generationOptions = useMemo(
    () => [ALL_OPTION, ...sortedGroups.map(([generation]) => `${generation}기`)],
    [sortedGroups],
  );

  const filteredProjects = flatProjects.filter((project) => {
    const matchGeneration = selectedGeneration === ALL_OPTION || `${project.generation}기` === selectedGeneration;
    const matchCategory = selectedCategory === ALL_OPTION || project.category === selectedCategory;
    return matchGeneration && matchCategory;
  });

  const isGenerationAll = selectedGeneration === ALL_OPTION;
  const isCategoryAll = selectedCategory === ALL_OPTION;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const byGeneration = Number(b.generation) - Number(a.generation);
    const byCategory = getCategoryRank(a.category) - getCategoryRank(b.category);

    if (isGenerationAll && isCategoryAll) return byGeneration || byCategory;
    if (!isGenerationAll && isCategoryAll) return byCategory;
    if (isGenerationAll && !isCategoryAll) return byGeneration;
    return 0;
  });

  // 불러오기 실패는 데이터 자체가 없을 때만 노출한다.
  // 목록은 있는데 필터 결과만 비어 있는 경우는 '조건에 맞는 프로젝트가 없습니다'가 맞다
  const hasLoadedProjects = flatProjects.length > 0;

  return (
    <Wrapper>
      <ToastWrapper>
        <Toast
          variant="positive"
          text="삭제가 완료되었습니다."
          show={isDeletedToastOpen}
          onHidden={() => setIsDeletedToastOpen(false)}
        />
        <Toast
          variant="positive"
          text="등록이 완료되었습니다."
          show={isCreatedToastOpen}
          onHidden={() => setIsCreatedToastOpen(false)}
        />
        <Toast
          variant="positive"
          text="변경사항이 저장되었습니다."
          show={isUpdatedToastOpen}
          onHidden={() => setIsUpdatedToastOpen(false)}
        />
      </ToastWrapper>
      <FilterRow>
        <FilterGroup>
          <ProjectFilterSelect
            heading="기수 구분"
            options={generationOptions}
            value={selectedGeneration}
            onChange={setSelectedGeneration}
          />
          <ProjectFilterSelect
            heading="프로젝트 구분"
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
        </FilterGroup>
        {userProfile && isAdminRole(userProfile.role) && (
          <AddButtonWrapper>
            <Button
              variant="solid"
              color="primary"
              size="large"
              trailingIcon={<IcAdd width={20} height={20} />}
              onClick={() => router.push('/project/upload')}
            >
              프로젝트 추가
            </Button>
          </AddButtonWrapper>
        )}
      </FilterRow>
      {isLoading ? (
        <LoadingWrapper>
          <CircularLoading size={32} />
        </LoadingWrapper>
      ) : isError && !hasLoadedProjects ? (
        <ProjectEmptyState icon={<IcFailure width={64} height={64} />} message="정보 불러오기를 실패했어요." />
      ) : sortedProjects.length === 0 ? (
        <ProjectEmptyState />
      ) : (
        <CardGrid>
          {sortedProjects.map((project, index) => (
            <ProjectCard key={project.id} {...project} cardPosition={index} totalImageCount={sortedProjects.length} />
          ))}
        </CardGrid>
      )}
    </Wrapper>
  );
};

export default ProjectsSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 46px;
  width: 100%;
  max-width: 1100px;
  padding: 0 20px;
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

/* 모바일 시안에는 운영진용 추가 버튼이 없고, 업로드 폼도 데스크톱 전용이라 숨긴다 */
const AddButtonWrapper = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 468px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px 20px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
