import type { StandartRepsonse } from "@/model/response_model";
import type { AxiosError } from "axios";
import { useToast } from "vue-toastification";

export default function axiosCatch(error: any): void {
    const err = error as AxiosError;
    var message = "An error occured";
    if (err.response?.data) {
        /// Means that the user is more not logged in
        if (err.response.status === 401 && import.meta.env.PROD) {
            console.log("401");
        }
        message = (err.response?.data as StandartRepsonse<Object>).message;
    }
    useToast().error(message);
}