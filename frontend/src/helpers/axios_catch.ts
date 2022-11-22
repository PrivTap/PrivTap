import type { StandartRepsonse } from "@/model/response_model";
import { useAuthStore } from "@/stores/auth_store";
import type { AxiosError } from "axios";

export default function axiosCatch(error: any): StandartRepsonse<Object>{
    const err = error as AxiosError;
    if (err.response?.data) {
        /// Means that the user is more not logged in
        if(err.status === 401){
            useAuthStore().logout(true);
        }
        return err.response?.data as StandartRepsonse<Object>;
    }
    return {
        status: false,
        message: "Somenthing went wrong..",
    } as StandartRepsonse<Object>;
}