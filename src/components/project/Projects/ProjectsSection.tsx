import { ProjectsArrayType } from '@@types/request';
import Archiving from '@archiving/Archiving';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';

const ProjectsSection = () => {
  const { data, isLoading } = useQuery<ProjectsArrayType>(['projects'], getProjects);
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {Object.entries(data as ProjectsArrayType)!.map(([generation, value]) => (
        <Archiving archivingIndex={generation} archivingData={value} key={generation} />
      ))}
    </>
  );
};

export default ProjectsSection;
