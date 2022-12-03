import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type TriggerModel from "@/model/trigger_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";
 


export interface IManageTrigger {

  createTrigger(
    name: string,
    description: string,
    serviceId: string,
    permission: string[],
  ): Promise<TriggerModel | null>;

  getTriggerById(
    triggerId: string
    ): Promise<TriggerModel | null>;

  updateTrigger(
    name: string,
    serviceId: string,
    description: string,
    permission: string[],
    ): Promise<TriggerModel | null>;

  deleteTrigger(
    triggerId: string
    ): Promise<TriggerModel[] | null>;

  getAllTriggers(
  serviceId: string,
  ): Promise<TriggerModel[] | null>;
  }
  
  export default class ManageTrigger
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


    async getAllTriggers(serviceId: string): Promise<TriggerModel[]> {
      try {
          const response = await this.http.get(this.path, { params: { serviceId } });
          this.triggers.value = response.data.data as TriggerModel[];
          return this.triggers.value;
      } catch (error) {
          axiosCatch(error);
          return this.triggers.value;
      }
  }



    async getTriggerById(triggerId: string): Promise<TriggerModel | null> {
      try {
        const res = await this.http.get(this.path, { params: { triggerId } });
        return res.data.data as TriggerModel;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }


    async createTrigger(
      name: string,
      description: string,
      serviceId: string,
      permission: string[],
    ): Promise<TriggerModel | null> {
      const body = {
        name: name,
        description: description,
        serviceId: serviceId,
        permission: permission,
      };
      try {
        const res = await this.http.post(this.path, body);
        useToast().success("Trigger created");
        return res.data.data as TriggerModel;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }

    
  async updateTrigger(
    name: string,
    serviceId: string,
    description: string,
    permission: string[],
): Promise<TriggerModel | null> {
  try {
    const body = {
      name: name,
      serviceId: serviceId,
      description: description,
      permission: permission,
    }
    const res = await this.http.put(this.path, body);
    useToast().success("Trigger updated");
    return res.data.data as TriggerModel;
  } catch (error) {
    axiosCatch(error);
    return null;
  }
}




async deleteTrigger(triggerId: string): Promise<Array<TriggerModel> | null> {
  try {
    const body = { "triggerId": triggerId }
    const res = await this.http.delete(this.path, { data: body });
    this.triggers.value = this.triggers.value.filter((trigger) => trigger._id !== triggerId);
    useToast().success("Trigger deleted");
    return this.triggers.value;
  } catch (error) {
    axiosCatch(error);
    return null;
  }
}




}