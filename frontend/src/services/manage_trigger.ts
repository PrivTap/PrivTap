import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type PermissionModel from "@/model/permission_model";
import type TriggerModel from "@/model/trigger_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";
 


export default interface IManageTrigger {

  createTrigger(
    triggerId: string,
    name: string,
    serviceId: string,
    description: string,
    premission: PermissionModel[],
  ): Promise<TriggerModel | null>;

  getTriggerById(
    triggerId: string
    ): Promise<TriggerModel | null>;

  updateTrigger(
    triggerId: string,
    name: string,
    serviceId: string,
    description: string,
    premission: PermissionModel[],
    ): Promise<TriggerModel | null>;

  deleteTrigger(
    triggerId: string
    ): Promise<TriggerModel[] | null>;

  getAllTriggers(

  ): Promise<TriggerModel[] | null>;
  }
  
  export class ManageTrigger
   implements IManageTrigger {

    private static _instance: ManageTrigger;

    http: AxiosInstance;
  
    private constructor() {
      this.http = http();
    }

  
  
    static get getInstance(): ManageTrigger {
      if (!ManageTrigger._instance) {
        ManageTrigger._instance = new ManageTrigger();
      }
      return ManageTrigger._instance;
    }
  
    path: string = "/manage-triggers";
  
    triggers = ref<TriggerModel[]>([]); 
  
    async getAllTriggers(): Promise<TriggerModel[] | null> {
      try {
        const res = await this.http.get(this.path);
        this.triggers.value = res.data.data as TriggerModel[];
        return res.data.data;
      } catch (error) {
        axiosCatch(error);
        return null;
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
      triggerId: string,
      name: string,
      serviceId: string,
      description: string,
      premission: PermissionModel[],
    ): Promise<TriggerModel | null> {
      const body = {
        triggerId: triggerId,
        name: name,
        serviceId: serviceId,
        description: description,
        premission: premission,
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
    triggerId: string,
    name: string,
    serviceId: string,
    description: string,
    premission: PermissionModel[],
): Promise<TriggerModel | null> {
  try {
    const body = {
      triggerId: triggerId,
      name: name,
      serviceId: serviceId,
      description: description,
      premission: premission,
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