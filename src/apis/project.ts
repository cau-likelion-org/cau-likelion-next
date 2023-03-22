import { ArchivingArrayType, IProjectData, IProjectDetail, ResponseData } from '@@types/request';
import axios from 'axios';

export async function getProjects() {
  const data = await axios
    .get<ResponseData<ArchivingArrayType<IProjectData>>>('https://api.cau-likelion.org/project')
    .then((res) => res.data.data);
  return data;
}

export async function getProjectDetail(id: string) {
  const data = await axios
    .get<ResponseData<IProjectDetail>>(`https://api.cau-likelion.org/project/${id}`)
    .then((res) => res.data.data);
  return data;
}
