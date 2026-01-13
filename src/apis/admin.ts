import axios from 'axios';

// export function postGalleryData(data: IProjectDetail, token: IToken) {
//   const authAxios = getAuthAxios(token);
//   return authAxios.post(`/api/admin/postProject`, {
//     data,
//   });
// }

export async function postGalleryData(data: FormData) {
  const result = await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}/api/project`, data, {
    withCredentials: true,
  });
  return result;
}
