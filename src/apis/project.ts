import { ArchivingArrayType, IProjectData } from '@@types/request';
import axios from 'axios';
import projectBackupData from './backup/project.json';
export async function getProjects() {
  try {
    const res = await axios.get<ArchivingArrayType<IProjectData>>(`/projects/project/`);
    return res.data;
  } catch (err) {
    console.log(err);
    return new Promise<ArchivingArrayType<IProjectData>>((resolve) => resolve(projectBackupData));
  }
}
