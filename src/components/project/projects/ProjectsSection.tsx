import { ArchivingArrayType, IProjectData } from '@@types/request';
import Archiving from '@archiving/Archiving';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';
import { sortArchivingListDesc } from '@utils/index';
import styled from 'styled-components';

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType<IProjectData> }) => {
  const { data, isLoading } = useQuery<ArchivingArrayType<IProjectData>>(['projects'], getProjects);

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
