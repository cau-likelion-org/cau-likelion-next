import React from 'react';
import { useQuery } from 'react-query';
import { getProjects } from 'src/apis/project';
import { ObjectFlags } from 'typescript';
import Projects from './Projects';
export interface IGenerationData {
  title: string;
  dev_stack: number[];
  description: string;
  event: string;
  thumbnail: string;
}
export type Res = Record<string, IGenerationData[]>;
const ProjectsSection = () => {
  const { data, isLoading } = useQuery<Res>(['projects'], getProjects);
  console.log(data && Object.entries(data));
  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      {Object.entries(data as Res)!.map(([generation, value]) => (
        <Projects generation={generation} generationData={value} key={generation} />
      ))}
    </>
  );
};

export default ProjectsSection;
