import { IToken } from 'src/store/useTokenStore';
import { getAuthAxios } from './authAxios';

export type UploadDomain = 'PROJECT' | 'HISTORY' | 'SESSION' | 'ACTIVITY' | 'ROADMAP' | 'ASSIGNMENT';

export interface FileUploadResponse {
  url: string;
}

export const uploadFile = (token: IToken, domain: UploadDomain, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return getAuthAxios(token)
    .post<FileUploadResponse>(`/api/files/${domain}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};
