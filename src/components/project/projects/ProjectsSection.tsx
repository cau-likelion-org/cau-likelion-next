import { ArchivingArrayType, IProjectData } from '@@types/request';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getProjects } from 'src/apis/project';
import { sortArchivingListDesc } from '@utils/index';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';
import ProjectEmptyState from './ProjectEmptyState';
import ProjectFilterSelect from './ProjectFilterSelect';

const ALL_OPTION = '전체';

const CATEGORY_PRIORITY: Record<string, number> = {
  중커톤: 0,
  해커톤: 1,
  아이디어톤: 2,
};
const getCategoryRank = (category: string) => CATEGORY_PRIORITY[category] ?? 3;

interface FlatProject extends IProjectData {
  generation: string;
}

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType<IProjectData> }) => {
  const { data, isLoading } = useQuery<ArchivingArrayType<IProjectData>>({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const [selectedGeneration, setSelectedGeneration] = useState(ALL_OPTION);
  const [selectedCategory, setSelectedCategory] = useState(ALL_OPTION);

  const sortedGroups = sortArchivingListDesc(isLoading ? staticData : (data as ArchivingArrayType<IProjectData>))!;

  const flatProjects: FlatProject[] = useMemo(
    () => sortedGroups.flatMap(([generation, projects]) => projects.map((project) => ({ ...project, generation }))),
    [sortedGroups],
  );

  const generationOptions = useMemo(
    () => [ALL_OPTION, ...sortedGroups.map(([generation]) => `${generation}기`)],
    [sortedGroups],
  );

  const categoryOptions = useMemo(
    () => [ALL_OPTION, ...Array.from(new Set(flatProjects.map((project) => project.category).filter(Boolean)))],
    [flatProjects],
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

  return (
    <Wrapper>
      <FilterRow>
        <ProjectFilterSelect
          heading="기수 구분"
          options={generationOptions}
          value={selectedGeneration}
          onChange={setSelectedGeneration}
        />
        <ProjectFilterSelect
          heading="프로젝트 구분"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </FilterRow>
      {sortedProjects.length === 0 ? (
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
  width: 1060px;
  max-width: 100%;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 500px) {
    flex-wrap: wrap;
  }
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
