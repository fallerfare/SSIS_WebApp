import { axiosPublic } from "../controller/axios";
const REGISTER_URL = "/api/auth/register"
import type { UserData } from "../models/types/UserData"; 

const useRegister = () => {

    const register = async (identity: UserData) => {
    const response = await axiosPublic.post(
        REGISTER_URL,
        JSON.stringify(identity),
        { headers: { "Content-Type": "application/json" } }
    );


    return response.data;
    };

return register;
};

export default useRegister;

