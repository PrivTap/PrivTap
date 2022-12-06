import axiosInstance from "@/helpers/axios_service";
import axiosCatch from "@/helpers/axios_catch";
import {useToast} from "vue-toastification";


export class GenericServices<T> {

    async get<T>(path: string, config?: { query?: object, headers?: object, message?: string }): Promise<T | null> {
        try {
            const res = await axiosInstance.get(path, {params: config?.query, headers: config?.headers});
            if (config?.message != undefined)
                if (res.status == 200)
                    useToast().success(config.message);
            return res.data.data as T;
        } catch (error) {
            axiosCatch(error);
            return null
        }
    }

}