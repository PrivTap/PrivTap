import {ref} from "vue";
import type SimpleServiceModel from "@/model/simple_service_model";
import type Ref from "vue";
import {GenericServices} from "@/services/generic-services";

const path = "/services";
let services = ref<SimpleServiceModel[]>([]);

export interface IShowServices {
    getAllServices(): Promise<Ref.Ref<SimpleServiceModel[]>>;

    getAuthorizedServices(): Promise<Ref.Ref<SimpleServiceModel[]>>;
}

export class ShowServices extends GenericServices<SimpleServiceModel> implements IShowServices {


    async getAllServices(): Promise<Ref.Ref<SimpleServiceModel[]>> {
        const result = await super.get<SimpleServiceModel[]>(path)
        services.value = !!result ? result : [];
        return services;
    }

    async getAuthorizedServices(): Promise<Ref.Ref<SimpleServiceModel[]>> {
        const result = await super.get<SimpleServiceModel[]>(path, {query: {authorized: true}})
        services.value = !!result ? result : [];
        return services;
    }

    getRef() {
        return services;
    }
}

export default new ShowServices();
