import { ArchivingArrayType, IProjectData, IProjectDetail, ResponseData } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export async function getProjects() {
  const data = await axios
    .get<ResponseData<ArchivingArrayType<IProjectData>>>(`${url}/api/project`)
    .then((res) => res.data.data);
  return data;
}

export async function getProjectDetail(id: string) {
  const data = await axios.get<ResponseData<IProjectDetail>>(`${url}/api/project/${id}`).then((res) => res.data.data);
  console.log(data);
  return data;
}
