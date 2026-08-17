import { useMemo, useState } from 'react';
import styled from 'styled-components';

import Card from '@common/card/Card';
import Checkbox from '@common/checkbox/Checkbox';
import ContentBadge from '@common/badge/ContentBadge';
import PaginationNavigation from '@common/pagination/PaginationNavigation';
import ProjectFilterSelect from '@project/projects/ProjectFilterSelect';
import { PROJECT_CATEGORY_OPTIONS } from '@utils/constant';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export interface FeaturedProject {
  id: string;
  name: string;
  generation: string;
  category: string;
  selected: boolean;
  thumbnail: string;
}

const ALL_OPTION = '전체';
const GENERATION_OPTIONS = [ALL_OPTION, '14기', '13기'];
const CATEGORY_OPTIONS = [ALL_OPTION, ...PROJECT_CATEGORY_OPTIONS];
const PAGE_SIZE = 9;

const ProjectSection = ({
  projects,
  onChange,
  disabled = false,
}: {
  projects: FeaturedProject[];
  onChange: (projects: FeaturedProject[]) => void;
  disabled?: boolean;
}) => {
  const [generationFilter, setGenerationFilter] = useState(ALL_OPTION);
  const [categoryFilter, setCategoryFilter] = useState(ALL_OPTION);
  const [page, setPage] = useState(1);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchGeneration = generationFilter === ALL_OPTION || project.generation === generationFilter;
        const matchCategory = categoryFilter === ALL_OPTION || project.category === categoryFilter;
        return matchGeneration && matchCategory;
      }),
    [projects, generationFilter, categoryFilter],
  );

  const totalPage = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const pagedProjects = filteredProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleProject = (id: string) => {
    onChange(projects.map((project) => (project.id === id ? { ...project, selected: !project.selected } : project)));
  };

  return (
    <Section>
      <Title>프로젝트</Title>
      <FilterRow>
        <ProjectFilterSelect
          heading="기수 구분"
          options={GENERATION_OPTIONS}
          value={generationFilter}
          onChange={(value) => {
            setGenerationFilter(value);
            setPage(1);
          }}
        />
        <ProjectFilterSelect
          heading="프로젝트 구분"
          options={CATEGORY_OPTIONS}
          value={categoryFilter}
          onChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}
        />
      </FilterRow>
      <CardGrid>
        {pagedProjects.map((project) => (
          <Card
            key={project.id}
            title={project.name}
            thumbnailSrc={project.thumbnail}
            thumbnailAlt={project.name}
            thumbnailRatio={246 / 138.375}
            thumbnailOverlay={false}
            bottomContent={
              <CardFooter>
                <BadgeRow>
                  <ContentBadge text={project.generation} color="accent" size="small" />
                  <ContentBadge text={project.category} color="accent" size="small" />
                </BadgeRow>
                <Checkbox
                  checked={project.selected}
                  onChange={() => toggleProject(project.id)}
                  ariaLabel={`${project.name} 노출 여부`}
                  readOnly={disabled}
                />
              </CardFooter>
            }
          />
        ))}
      </CardGrid>
      <PaginationRow>
        <PaginationNavigation variant="extended" currentPage={page} totalPage={totalPage} onPageChange={setPage} />
      </PaginationRow>
    </Section>
  );
};

export default ProjectSection;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 20px;
  width: 100%;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
