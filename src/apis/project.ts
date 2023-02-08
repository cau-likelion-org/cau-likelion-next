import { Res } from '@project/Projects/ProjectsSection';
import axios from 'axios';
export function getProjects() {
  return axios
    .get<Res>(`https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/projects`)
    .then((res) => res.data);
}
