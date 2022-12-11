import axiosInstance from "@/helpers/axios_service";
import axiosCatch from "@/helpers/axios_catch";
import { useToast } from "vue-toastification";
import type Ref from "vue";


export abstract class GenericController<T> {
    /**
     * A generic get of the function.
     * @param path the path of the url. So if the url is http://local.com/service-trigger then you will need to pass "service-trigger"
     * @param config An object in which to pass the configuration options :
     * <br>
     * - query: an object containing all the value you want to pass in the query string <br>
     * - headers: an object containing all the value you want to pass in the headers <br>
     * - message: the message you want to show when the request has 200 as status <br>
     * @return The data contained in the response as an object of type T. If there is an error it will return an empty object
     */
    protected async get<T>(path: string, config?: { query?: object, headers?: object, message?: string }): Promise<T | null> {
        try {
            const res = await axiosInstance.get(path, { params: config?.query, headers: config?.headers });
            if (config?.message != undefined)
                useToast().success(config.message);
            return res.data.data as T;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }

    protected async delete(path: string, config?: { body?: object, message?: string }) {
        try {
            await axiosInstance.delete(path, { data: config?.body });
            if (config?.message != undefined)
                useToast().success(config.message);
        } catch (error) {
            axiosCatch(error);
        }

    }

    protected async post<T>(path: string, config?: { body?: object, message?: string }): Promise<T | null> {
        try {
            const res = await axiosInstance.post(path, config?.body);
            if (config?.message != undefined)
                useToast().success(config.message);
            return res.data.data as T;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }
    protected async put<T>(path: string, config?: { body?: object, message?: string }): Promise<T | null> {
        try {
            const res = await axiosInstance.put(path, config?.body);
            if (config?.message != undefined)
                useToast().success(config.message);
            return res.data.data as T;
        } catch (error) {
            axiosCatch(error);
            return null;
        }
    }

    abstract getRef(): Ref.Ref<T>;
}