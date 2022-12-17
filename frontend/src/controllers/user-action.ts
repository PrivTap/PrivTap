import {ref, type Ref} from "vue";
import {GenericController} from "./generic_controller";
import type ActionModel from "@/model/action_model";

const path: string = "/actions";
let actions = ref<ActionModel[]>([]);

export interface IUserAction {
    getAllActions(serviceId: string): Promise<ActionModel[]>;
    getAuthorizedActions(serviceId: string): Promise<ActionModel[]>;

}


class UserAction extends GenericController<ActionModel[]> implements IUserAction {
    getRef(): Ref<ActionModel[]> {
        return actions;
    }

    async getAllActions(serviceId: string, valueToReturn: boolean = false): Promise<ActionModel[]> {
        const res = await super.get<ActionModel[]>(path, {query: {serviceId}});
        if (!valueToReturn)
            actions.value = actions.value = res != null ? res : [];
        return res != null ? res : [];
    }

    async getAuthorizedActions(serviceId: string, valueToReturn: boolean = false): Promise<ActionModel[]> {
        const res = await super.get<ActionModel[]>(path, {query: {serviceId, authorized: true}});
        if (!valueToReturn)
            actions.value = actions.value = res != null ? res : [];
        return res != null ? res : [];
    }

    getNewRef(): Ref<ActionModel[]> {
        return ref<ActionModel[]>([]);
    }

    async getCompatibleActions(serviceId: string, triggerId: string, valueToReturn: boolean = false): Promise<ActionModel[]> {
        const res = await super.get<ActionModel[]>(path, {query: {serviceId, triggerId}});
        if (!valueToReturn)
            actions.value = actions.value = res != null ? res : [];
        return res != null ? res : [];
    }

}

export default new UserAction();