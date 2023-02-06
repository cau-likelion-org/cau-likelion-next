import axios from "axios";
import { url } from ".";

export const getProfile = async () => {
    const response = await axios.get(
        `baseurl/user`,
        {}
    );
    return response.data.data.user;
};

export const login = async(code:string, accessToken?:string)=>{
    const response = await axios.post(`${url}/login`,
        {
            code : code,
            access_token : accessToken,
        },)

        return(
            response.data.data
            //is_active 받아오기 
            

        )
        

}