import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type TriggerModel from "@/model/trigger_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";
 


export interface IManageTrigger {
  getAllTriggers(serviceId: string): Promise<TriggerModel[]>;
  createTrigger(name: string, description: string, serviceId: string, permissions: string[], resourceServer: string): Promise<TriggerModel | null>;
  deleteTrigger(triggerId: string): Promise<TriggerModel[]>;
  updateTrigger(triggerId: string,
    name: string,
    description: string,
    permissions: string[],
    resourceServer: string): Promise<TriggerModel | null>;
}
  


  export class ManageTrigger
   implements IManageTrigger {

    private static _instance: ManageTrigger;


    http: AxiosInstance;
    path: string = "/manage-triggers";
    toast: any;
  
    private constructor() {
      this.http = http();
    }

  
  
    static get getInstance(): ManageTrigger {
      if (!ManageTrigger._instance) {
        ManageTrigger._instance = new ManageTrigger();
      }
      return ManageTrigger._instance;
    }
  
  
    triggers = ref<TriggerModel[]>([]);



    async getTriggerById(triggerId: string): Promise<TriggerModel | null> {
      try {
        const res = await this.http.get(this.path, { params: { triggerId } });
        return res.data.data as TriggerModel;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }


    async getAllTriggers(serviceId: string): Promise<TriggerModel[]> {
      try {
        const res = await this.http.get(this.path, { params: { serviceId } });
        this.triggers.value = res.data.data as TriggerModel[];
        console.log(this.triggers.value);
        return res.data.data;
      } catch (error) {
        axiosCatch(error);
        return this.triggers.value;
      }
    }


    async createTrigger(
      name: string,
      description: string,
      serviceId: string,
      permissions: string[],
      resourceServer: string,
    ): Promise<TriggerModel | null> {
      const body = {
        name: name,
        description: description,
        serviceId: serviceId,
        permissions: permissions,
        resourceServer: resourceServer,
      };
      try {
        const res = await this.http.post(this.path, body);
        useToast().success("Trigger created");
        const trigger = res.data.data as TriggerModel;
        this.triggers.value.push(trigger);
        return trigger;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
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
        const res = await this.http.put(this.path, body);
        useToast().success("Trigger updated");
        const updatedTrigger = res.data.data as TriggerModel;
        this.triggers.value = this.triggers.value.map((trigger) => {
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



//DELETE TRIGGER METHOD
async deleteTrigger(triggerId: string): Promise<TriggerModel[]> {
  try {
    const body = { "triggerId": triggerId }
    const res = await this.http.delete(this.path, { data: body });
    this.triggers.value = this.triggers.value.filter((trigger) => trigger._id !== triggerId);
    useToast().success("Trigger deleted");
    return this.triggers.value;
  } catch (error) {
    axiosCatch(error);
    return this.triggers.value;
  }
}





}