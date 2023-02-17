import { ProjectsArrayType } from '@@types/request';
import Archiving from '@archiving/Archiving';
import Project from '@home/project/component/Project';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';

const ProjectsSection = ({ staticData }: { staticData: ProjectsArrayType }) => {
  const { data, isLoading } = useQuery<ProjectsArrayType>(['projects'], getProjects);

  return (
    <>
      {Object.entries(isLoading ? staticData : (data as ProjectsArrayType))!.map(([generation, value]) => (
        <Archiving archivingIndex={generation} archivingData={value} key={generation} />
      ))}
    </>
  );
};

export default ProjectsSection;
