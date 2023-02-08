import Archiving from '@archiving/Archiving';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';

export interface IArchivingData {
  title: string;
  category: string;
  thumbnail: string;
  dev_stack?: number[];
  description?: string;
}
export type ProjectArrayType = Record<string, IArchivingData[]>;
const ProjectsSection = () => {
  const { data, isLoading } = useQuery<ProjectArrayType>(['projects'], getProjects);
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {Object.entries(data as ProjectArrayType)!.map(([generation, value]) => (
        <Archiving archivingIndex={generation} archivingData={value} key={generation} />
      ))}
    </>
  );
};

export default ProjectsSection;
