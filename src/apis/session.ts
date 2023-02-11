import { SessionsArrayType } from '@@types/request';
import axios from 'axios';

export async function getSessions() {
    const res = await axios.get<SessionsArrayType>(`https://b3551adf-6020-42dc-b998-c947dbd93919.mock.pstmn.io/sessions`);
    return res.data;
}