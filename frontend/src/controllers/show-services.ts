import type Ref from "vue";
import {ref} from "vue";
import type SimpleServiceModel from "@/model/simple_service_model";
import {GenericController} from "@/controllers/generic_controller";

const path = "/services";
let services = ref<SimpleServiceModel[]>([]);

export interface IShowServices {
    getAllServices(): Promise<void>;

    getAuthorizedServices(): Promise<void>;
}

class ShowServices extends GenericController<SimpleServiceModel[]> implements IShowServices {


    async getAllServices(): Promise<void> {
        const res = await super.get<SimpleServiceModel[]>(path)
        services.value = res != null ? res : [];
    }

    async getAuthorizedServices(): Promise<void> {
        const res =await super.get<SimpleServiceModel[]>(path, {query: {authorized: true}});
        services.value = res != null ? res : [];
    }

    getRef(): Ref.Ref<SimpleServiceModel[]> {
        return services;
    }
}

export default new ShowServices();
