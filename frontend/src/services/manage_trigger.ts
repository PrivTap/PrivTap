import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type TriggerModel from "@/model/trigger_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
 


export default interface IManageTrigger {
    getAllTriggers(): Promise<TriggerModel[] | null>;
  }
  
  export class ManageTrigger implements IManageTrigger {

    private static _instance: ManageTrigger;
    http: AxiosInstance;
  
    private constructor() {
      this.http = http();
    }
   

  
    public static getInstance(): ManageTrigger {
      if (!ManageTrigger._instance) {
        ManageTrigger._instance = new ManageTrigger();
      }
      return ManageTrigger._instance;
    }
  
    path: string = "/manage-trigger";
  
    rules = ref<TriggerModel[]>([]); 
  
    async getAllTriggers(): Promise<TriggerModel[] | null> {
      try {
        const res = await this.http.get(this.path);
        this.rules.value = res.data.data as TriggerModel[];
        return res.data.data;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }

}