import { axiosPublic } from "../controller/axios";
import useAuth from "./useAuth";
const LOGIN_URL = "/api/auth/login"

const useLogin = () => {
    const { setAuth } = useAuth();

    const login = async (identity: string, pwd: string) => {
    const response = await axiosPublic.post(
        LOGIN_URL,
        JSON.stringify({
            identity,
            user_password: pwd
        }),
        {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        }
    );


    const { accessToken, role, user } = response.data;
    setAuth({ accessToken, role, user });

    return { accessToken, role, user };
    };

return login;
};

export default useLogin;
