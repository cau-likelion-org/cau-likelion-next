import { ArchivingArrayType } from '@@types/request';
import Archiving from '@archiving/Archiving';
import Project from '@home/project/component/Project';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType; }) => {
  const { data, isLoading } = useQuery<ArchivingArrayType>(['projects'], getProjects);

  return (
    <>
      {Object.entries(isLoading ? staticData : (data as ArchivingArrayType))!.map(([generation, value]) => (
        <Archiving archivingType={'project'} archivingIndex={generation} archivingData={value} key={generation} />
      ))}
    </>
  );
};

export default ProjectsSection;
