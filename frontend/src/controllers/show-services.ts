import type Ref from "vue";
import { ref } from "vue";
import type SimpleServiceModel from "@/model/simple_service_model";
import { GenericController } from "@/controllers/generic_controller";

const path = "/services";
let services = ref<SimpleServiceModel[]>([]);

export interface IShowServices {
    getAllServices(): Promise<void>;
    getAuthorizedServices(): Promise<void>;
}

class ShowServices extends GenericController<SimpleServiceModel[]> implements IShowServices {


    async getAllServices(): Promise<void> {
        services.value = await super.get<SimpleServiceModel[]>(path);
    }

    async getAuthorizedServices(): Promise<void> {
        services.value = await super.get<SimpleServiceModel[]>(path, { query: { authorized: true } });
    }

    getRef(): Ref.Ref<SimpleServiceModel[]> {
        return services;
    }
}

export default new ShowServices();
