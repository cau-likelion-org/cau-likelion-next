import { ArchivingArrayType, IProjectData, UserProfile } from '@@types/request';
import Button from '@common/button/Button';
import CircularLoading from '@common/loading/CircularLoading';
import EmptyState from '@common/emptyState/EmptyState';
import Toast from '@common/toast/Toast';
import PageScrollbar from '@common/pageScrollbar/PageScrollbar';
import { IcAdd } from '@assets/svg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getUserProfile } from 'src/apis/account';
import useSessionFlagToast from 'src/hooks/useSessionFlagToast';
import {
  PROJECT_CATEGORY_LABEL,
  PROJECT_CREATED_FLAG_KEY,
  PROJECT_DELETED_FLAG_KEY,
  PROJECT_UPDATED_FLAG_KEY,
  getProjects,
} from 'src/apis/project';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole, sortArchivingListDesc } from '@utils/index';
import usePageEngagementTracking from 'src/hooks/usePageEngagementTracking';
import { track, getDeviceType } from 'src/lib/amplitude';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';
import ProjectFilterSelect from './ProjectFilterSelect';
import { containerCss, media } from '@utils/constant/breakpoint';

const ALL_OPTION = '전체';

const CATEGORY_OPTIONS = [ALL_OPTION, ...Object.values(PROJECT_CATEGORY_LABEL)];

const getStartTime = (startDate?: string) => {
  const time = new Date(startDate ?? '').getTime();
  return Number.isNaN(time) ? 0 : time;
};

// react-hooks/purity가 useEffect/useRef 안의 Date.now() 호출도 막아서, 계측용 타임스탬프는 밖에서 받는다
const now = () => Date.now();

interface FlatProject extends IProjectData {
  generation: string;
}

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType<IProjectData> | null }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, isError } = useQuery<ArchivingArrayType<IProjectData>>({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: staticData ?? undefined,
  });

  const router = useRouter();
  // 목록↔상세는 같은 페이지 컴포넌트(얕은 라우팅)라서, 상세를 열고 닫아도 하나의 체류시간으로 합산된다
  usePageEngagementTracking({ pagePath: '/project', exitEvent: 'Project Tab Page Exited' });

  const tokenState = useTokenStore((state) => state.token);
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const [selectedGeneration, setSelectedGeneration] = useState(ALL_OPTION);
  const [selectedCategory, setSelectedCategory] = useState(ALL_OPTION);

  const deletedToast = useSessionFlagToast(PROJECT_DELETED_FLAG_KEY);
  const createdToast = useSessionFlagToast(PROJECT_CREATED_FLAG_KEY);
  const updatedToast = useSessionFlagToast(PROJECT_UPDATED_FLAG_KEY);

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

  const sortedProjects = [...filteredProjects].sort(
    (a, b) =>
      Number(b.generation) - Number(a.generation) ||
      getStartTime(b.startDate) - getStartTime(a.startDate) ||
      a.title.localeCompare(b.title, 'ko'),
  );

  const hasLoadedProjects = flatProjects.length > 0;

  // 목록에 보이는 카드 썸네일이 전부 로드되기까지 걸린 시간을 잰다 (필터가 바뀌어 카드 수가 달라지면 다시 잰다)
  const imageLoadRef = useRef({ loadedCount: 0, totalCount: 0, startedAt: 0, fired: false });
  useEffect(() => {
    imageLoadRef.current = { loadedCount: 0, totalCount: sortedProjects.length, startedAt: now(), fired: false };
  }, [sortedProjects.length]);

  const handleThumbnailLoad = () => {
    const state = imageLoadRef.current;
    state.loadedCount += 1;
    if (state.fired || state.totalCount === 0 || state.loadedCount < state.totalCount) return;
    state.fired = true;
    track('Image Load Completed', {
      page_path: '/project',
      load_duration_ms: now() - state.startedAt,
      image_count: state.totalCount,
      device_type: getDeviceType(),
    });
  };

  const handleCardClick = (project: FlatProject, position: number) => {
    track('Archiving Card Clicked', {
      archiving_type: 'project',
      item_id: project.id,
      item_title: project.title,
      card_position: position,
      referrer_path: router.asPath,
    });
  };

  return (
    <>
      <Wrapper ref={contentRef}>
        <ToastWrapper>
          <Toast
            variant="positive"
            text="삭제가 완료되었습니다."
            show={deletedToast.isOpen}
            onHidden={deletedToast.onHidden}
          />
          <Toast
            variant="positive"
            text="등록이 완료되었습니다."
            show={createdToast.isOpen}
            onHidden={createdToast.onHidden}
          />
          <Toast
            variant="positive"
            text="변경사항이 저장되었습니다."
            show={updatedToast.isOpen}
            onHidden={updatedToast.onHidden}
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
          <EmptyState variant="error" />
        ) : sortedProjects.length === 0 ? (
          <EmptyState message="조건에 맞는 프로젝트가 없습니다." />
        ) : (
          <CardGrid>
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                {...project}
                onClick={() => handleCardClick(project, index)}
                onThumbnailLoad={handleThumbnailLoad}
              />
            ))}
          </CardGrid>
        )}
      </Wrapper>
      <PageScrollbar contentRef={contentRef} />
    </>
  );
};

export default ProjectsSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 46px;
  ${containerCss}
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

  ${media.xs} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  ${media.md} {
    grid-template-columns: repeat(4, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(5, 1fr);
  }
`;
