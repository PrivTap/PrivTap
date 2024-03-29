import type TriggerModel from "@/model/trigger_model";
import {ref, type Ref} from "vue";
import {GenericController} from "./generic_controller";

const path: string = "/manage-triggers";
let triggers = ref<TriggerModel[]>([]);

export interface IManageTrigger {
    getAllTriggers(serviceId: string): Promise<void>;

    createTrigger(name: string, description: string, serviceId: string, permissions: string[], resourceServer: string, outputs: string): Promise<void>;

    deleteTrigger(triggerId: string): Promise<void>;

    updateTrigger(triggerId: string,
                  name: string,
                  description: string,
                  permissions: string[],
                  resourceServer: string,
                  outputs: string): Promise<void>;
}


class ManageTrigger extends GenericController<TriggerModel[]> implements IManageTrigger {
    getRef(): Ref<TriggerModel[]> {
        return triggers;
    }

    async getAllTriggers(serviceId: string): Promise<void> {
        const res = await super.get<TriggerModel[]>(path, {query: {serviceId}});
        triggers.value = triggers.value = res != null ? res : [];
    }

    async createTrigger(
        name: string,
        description: string,
        serviceId: string,
        permissions: string[],
        resourceServer: string,
        outputs:string,
    ): Promise<void> {
        const body = {
            "name": name,
            "description": description,
            "serviceId": serviceId,
            "permissions": permissions,
            "resourceServer": resourceServer,
            outputs
        };
        const res = await super.post<TriggerModel>(path, {body: body, message: "Trigger created"});
        if (res != null)
            triggers.value.push(res);
    }

    async updateTrigger(
        triggerId: string,
        name: string,
        description: string,
        permissions: string[],
        resourceServer: string,
        outputs: string
    ): Promise<void> {
        const body = {
            triggerId: triggerId,
            name: name,
            description: description,
            permissions: permissions,
            resourceServer: resourceServer,
            outputs
        }
        const updatedTrigger = await super.put<TriggerModel>(path, {body: body, message: "Trigger updated"});
        if (!!updatedTrigger) {
            triggers.value = triggers.value.map((trigger) => {
                if (trigger._id === updatedTrigger._id) {
                    return updatedTrigger;
                }
                return trigger;
            });
        }
    }

    async deleteTrigger(triggerId: string): Promise<void> {
        const body = {"triggerId": triggerId}
        await super.delete(path, {body: body, message: "Trigger deleted"});
        triggers.value = triggers.value.filter((trigger) => trigger._id !== triggerId);
    }

}

export default new ManageTrigger();