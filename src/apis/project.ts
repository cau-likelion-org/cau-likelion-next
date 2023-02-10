import { ProjectsArrayType } from '@@types/request';
import axios from 'axios';
export async function getProjects() {
  const res = await axios.get<ProjectsArrayType>(`https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/projects`);
  return res.data;
}
