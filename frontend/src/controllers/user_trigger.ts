import type TriggerModel from "@/model/trigger_model";
import {ref, type Ref} from "vue";
import {GenericController} from "./generic_controller";

const path: string = "/triggers";
let triggers = ref<TriggerModel[]>([]);

export interface IUserTrigger {
    getAllTriggers(serviceId: string): Promise<TriggerModel[]>;

    getAuthorizedTriggers(serviceId: string): Promise<TriggerModel[]>;

}


class User_trigger extends GenericController<TriggerModel[]> implements IUserTrigger {
    /**
     * Return the object reference of this controller. The controller is a singleton, so the reference is the same for all the class
     */
    getRef(): Ref<TriggerModel[]> {
        return triggers;
    }

    /**
     *If value to return it's true, return the result of the request. When value to return it's false, the result of the request is stored inside the reference object.
     * The result of the request is the list of all the triggers of the service
     * @param serviceId the Id of the service to get the triggers
     * @param valueToReturn if true return the result of the request. Default false
     */
    async getAllTriggers(serviceId: string, valueToReturn: boolean = false): Promise<TriggerModel[]> {
        const res = await super.get<TriggerModel[]>(path, {query: {serviceId}});
        if (!valueToReturn)
            triggers.value = triggers.value = res != null ? res : [];
        return res != null ? res : [];
    }

    /**
     * If value to return it's true, return the result of the request. When value to return it's false, the result of the request is stored inside the reference object.
     * The result of the request is the list of all the triggers of the service that are authorized (All their permissions have been granted)
     * @param serviceId the Id of the service to get the triggers
     * @param valueToReturn if true return the result of the request. Default false
     */
    async getAuthorizedTriggers(serviceId: string, valueToReturn: boolean = false): Promise<TriggerModel[]> {
        const res = await super.get<TriggerModel[]>(path, {query: {serviceId, authorized: true}});
        if (!valueToReturn)
            triggers.value = triggers.value = res != null ? res : [];
        return res != null ? res : [];
    }

    /**
     * Return a new reference object. It will not be stored in this controller
     */

    getNewRef(): Ref<TriggerModel[]> {
        return ref<TriggerModel[]>([]);
    }
}

export default new User_trigger();