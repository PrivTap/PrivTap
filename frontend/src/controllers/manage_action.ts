import type ActionModel from "@/model/action_model";
import {ref, type Ref} from "vue";
import {GenericController} from "./generic_controller";

const path = "/manage-actions";
let actions = ref<ActionModel[]>([]);

export interface IManageAction {
    getAllActions(serviceId: string): Promise<void>;

    createAction(name: string, description: string, serviceId: string, permissions: string[], endpoint: string): Promise<void>;

    deleteAction(actionId: string): Promise<void>;

    updateAction(actionId: string,
                 name: string,
                 description: string,
                 permissions: string[],
                 endpoint: string): Promise<void>;
}

class ManageAction extends GenericController<ActionModel[]> implements IManageAction {
    getRef(): Ref<ActionModel[]> {
        return actions;
    }

    async getAllActions(serviceId: string) {
        const res = await super.get<ActionModel[]>(path, {query: {serviceId: serviceId}});
        actions.value = !!res ? res : [] ;
    }
 


    async createAction(
        name: string,
        description: string,
        serviceId: string,
        permissions: string[],
        endpoint: string,
    ): Promise<void> {
        const body = {
            name: name,
            description: description,
            serviceId: serviceId,
            permissions: permissions,
            endpoint: endpoint,
        };
        const res = await super.post<ActionModel>(path, {body: body, message: "Action created"});
        if (res != null)
            actions.value.push(res);
    }


    async updateAction(
        actionId: string,
        name: string,
        description: string,
        permissions: string[],
        endpoint: string,
    ): Promise<void> {
        const body = {
            actionId: actionId,
            name: name,
            description: description,
            permissions: permissions,
            endpoint: endpoint,
        }
        const res = await super.put<ActionModel>(path, {body: body, message: "Action updated"});
        if (res != null) {
            actions.value = actions.value.map((action) => {
                if (action._id === res._id) {
                    return res;
                }
                return action;
            });
        }
    }

    async deleteAction(actionId: string): Promise<void> {
        const body = {"actionId": actionId}
        await super.delete(path, {body: body, message: "Action deleted"});
        actions.value = actions.value.filter((action) => action._id !== actionId);
    }
}

export default new ManageAction();