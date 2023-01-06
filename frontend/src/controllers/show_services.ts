import type Ref from "vue";
import {ref} from "vue";
import type SimpleServiceModel from "@/model/simple_service_model";
import {GenericController} from "@/controllers/generic_controller";

const path = "/services";
let services = ref<SimpleServiceModel[]>([]);

export interface IShowServices {
    getAllServices(): Promise<SimpleServiceModel[]>;

    getAuthorizedServices(): Promise<SimpleServiceModel[]>;
}

class Show_services extends GenericController<SimpleServiceModel[]> implements IShowServices {

    /**
     *If value to return it's true, return the result of the request. When value to return it's false, the result of the request is stored inside the reference object.
     * The result of the request is the list of all the services
     * @param valueToReturn if true return the result of the request. Default false
     */
    async getAllServices(valueToReturn: boolean = false): Promise<SimpleServiceModel[]> {
        const res = await super.get<SimpleServiceModel[]>(path)
        if (!valueToReturn)
            services.value = res != null ? res : [];
        return res != null ? res : [];
    }
    /**
     * If value to return it's true, return the result of the request. When value to return it's false, the result of the request is stored inside the reference object.
     * The result of the request is the list of all the triggers of the service that are authorized (All their permissions have been granted)
     * @param valueToReturn if true return the result of the request. Default false
     */
    async getAuthorizedServices(valueToReturn: boolean = false) {
        const res = await super.get<SimpleServiceModel[]>(path, {query: {authorized: true}});
        if (!valueToReturn)
            services.value = res != null ? res : [];
        return res != null ? res : [];
    }

    /**
     * Return the object reference of this controller. The controller is a singleton, so the reference is the same for all the class
     */
    getRef(): Ref.Ref<SimpleServiceModel[]> {
        return services;
    }

    /**
     * Return a new reference object. It will not be stored in this controller
     */
    getNewRef(): Ref.Ref<SimpleServiceModel[]> {
        return ref<SimpleServiceModel[]>([]);
    }
}

export default new Show_services();
