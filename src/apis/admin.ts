import axios from 'axios';

export async function postGalleryData(data: FormData) {
  const result = await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}/api/project`, data, {
    withCredentials: true,
  });
  return result;
}
