import { ArchivingArrayType } from '@@types/request';
import axios from 'axios';
import projectBackupData from './backup/project.json';
export async function getProjects() {
  try {
    const res = await axios.get<ArchivingArrayType>(
      `https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/projects`,
    );
    return res.data;
  } catch (err) {
    return new Promise<ArchivingArrayType>((resolve) => resolve(projectBackupData));
  }
}
