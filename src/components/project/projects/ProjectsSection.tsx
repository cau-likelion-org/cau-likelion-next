import { ArchivingArrayType, IProjectData } from '@@types/request';
import Archiving from '@archiving/Archiving';
import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';

const ProjectsSection = ({ staticData }: { staticData: ArchivingArrayType<IProjectData>; }) => {
  const { data, isLoading } = useQuery<ArchivingArrayType<IProjectData>>(['projects'], getProjects);

  return (
    <>
      {Object.entries(isLoading ? staticData : (data as ArchivingArrayType<IProjectData>))!.map(
        ([generation, value]) => (
          <Archiving archivingType={'project'} archivingIndex={generation} archivingData={value} key={generation} />
        ),
      )}
    </>
  );
};

export default ProjectsSection;
