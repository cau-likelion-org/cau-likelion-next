import { LoginResponse, RequestSignUpForm, UserAttendance, UserProfile } from "@@types/request";
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
                Authorization: `Bearer ${form.accessToken}`
            }
        },
    );
};

export function patchUserProfile(userProfile: UserProfile, accessToken: string) {
    return axios.patch(
        `${url}/user`,
        {
            name: userProfile.name,
            generation: userProfile.generation,
            track: userProfile.track,
            is_admin: userProfile.isAdmin,
        },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    );
}

export const getUserProfile = async (accessToken: string) => {
    // const response = await axios.get<UserProfile>(
    //     `${url}/user`,
    //     {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     }
    // );
    // return response.data;
    return {
        name: '윤선영',
        generation: 11,
        track: 2,
        isAdmin: false
    };
};

export function login(code: string | string[], accessToken: string) {
    return axios.post<LoginResponse>(
        `${url}/login`,
        {
            code: code,
            accessToken: accessToken
        }
    ).then((res) => res.data);
}