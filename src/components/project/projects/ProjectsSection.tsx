import { ArchivingArrayType, IProjectData } from '@@types/request';
import Archiving from '@archiving/Archiving';
import React from 'react';
import { sortArchivingListDesc } from '@utils/index';
import styled from 'styled-components';
import useProjects from 'src/apis/queries/useProjects';

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType<IProjectData> }) => {
  const { projects: data, isLoading } = useProjects();

  return (
    <Wrapper>
      {sortArchivingListDesc(isLoading ? staticData : (data as ArchivingArrayType<IProjectData>))!.map(
        ([generation, value]) => (
          <Archiving archivingType="project" archivingIndex={generation} archivingData={value} key={generation} />
        ),
      )}
    </Wrapper>
  );
};

export default ProjectsSection;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem;
`;
