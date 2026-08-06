import { ArchivingArrayType, IProjectData, IProjectDetail, ResponseData } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export async function getProjects() {
  const data = await axios
    .get<ResponseData<ArchivingArrayType<IProjectData>>>(`${url}/api/project`, { timeout: 5000 })
    .then((res) => res.data.data);
  return data;
}

export async function getProjectDetail(id: string) {
  const data = await axios
    .get<ResponseData<IProjectDetail>>(`${url}/api/project/${id}`, { timeout: 5000 })
    .then((res) => res.data.data);
  console.log(data);
  return data;
}
