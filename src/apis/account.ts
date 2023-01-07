import axios from "axios";

export const getProfile = async () => {
    const response = await axios.get(
        `baseurl/user`,
        {}
    );
    return response.data.data.user;
};