import { RequestSignUpForm } from "@@types/request";
import { accessToken } from "@utils/state";
import axios from "axios";
import { url } from ".";


export const getEmailSecret = async (accessToken: string, emailValue: string) => {
    // const response = await axios.get(
    //     `${url}/cau_email`,
    //     {
    //         params: {
    //             user_email: emailValue
    //         },
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     }
    // );
    return { data: '1234' };
};

export const postEmailSecret = (accessToken: string, secretValue: string) => {
    // const response = axios.post(
    //     `${url}/cau_email`,
    //     {
    //         secret: secretValue
    //     },
    //     {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     }
    // ).then((res) => '1234');
    return '1235';
};


export function postSignUpForm(form: RequestSignUpForm) {
    return axios.post(
        `${url}/signup`,
        {
            name: form.name,
            generation: form.generation,
            track: form.track,
            is_admin: form.isAdmin,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        },
    );
    // return response.data.data.user;
};

// interface loginState {
//     is_active: boolean;
// }

export const login = async(code:string|string[], accessToken?:string): Promise<{code: string|string[]; is_active:boolean; status_code: number; accessToken: string}>=>{

    // const response = await axios.post(`${url}/login`,
    //     {
    //         code : code,
    //         access_token : accessToken,
    //     },)
    const response = {code: code, is_active: false, status_code: 201, accessToken: 'accessSuccess'}

    return response;
}