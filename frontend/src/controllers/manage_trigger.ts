import axiosCatch from "@/helpers/axios_catch";
import type TriggerModel from "@/model/trigger_model";
import { ref, type Ref } from "vue";
import { GenericController } from "./generic_controller";

const path: string = "/manage-triggers";
let triggers = ref<TriggerModel[]>([]);

export interface IManageTrigger {
  getAllTriggers(serviceId: string): Promise<void>;
  createTrigger(name: string, description: string, serviceId: string, permissions: string[], resourceServer: string): Promise<void>;
  deleteTrigger(triggerId: string): Promise<void>;
  updateTrigger(triggerId: string,
    name: string,
    description: string,
    permissions: string[],
    resourceServer: string): Promise<TriggerModel | null>;
}



class ManageTrigger extends GenericController<TriggerModel[]> implements IManageTrigger {
  getRef(): Ref<TriggerModel[]> {
    return triggers;
  }

  async getAllTriggers(serviceId: string): Promise<void> {
    const res = await super.get<TriggerModel[]>(path, { query: { serviceId } });
    triggers.value = res;
  }


  async createTrigger(
    name: string,
    description: string,
    serviceId: string,
    permissions: string[],
    resourceServer: string,
  ): Promise<void> {
    const body = {
      "name": name,
      "description": description,
      "serviceId": serviceId,
      "permissions": permissions,
      "resourceServer": resourceServer,
    };
    const res = await super.post<TriggerModel>(path, { body: body, message: "Trigger created" });
    triggers.value.push(res);
  }




  async updateTrigger(
    triggerId: string,
    name: string,
    description: string,
    permissions: string[],
    resourceServer: string,
  ): Promise<TriggerModel | null> {
    try {
      const body = {
        triggerId: triggerId,
        name: name,
        description: description,
        permissions: permissions,
        resourceServer: resourceServer,
      }
      const updatedTrigger = await super.put<TriggerModel | null>(path, { body: body, message: "Trigger updated" });
      if (!updatedTrigger) return null;
      triggers.value = triggers.value.map((trigger) => {
        if (trigger._id === updatedTrigger._id) {
          return updatedTrigger;
        }
        return trigger;
      });
      return updatedTrigger
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async deleteTrigger(triggerId: string): Promise<void> {
    const body = { "triggerId": triggerId }
    const res = await super.delete(path, { body: body, message: "Trigger deleted" });
    triggers.value = triggers.value.filter((trigger) => trigger._id !== triggerId);
  }

}

export default new ManageTrigger();