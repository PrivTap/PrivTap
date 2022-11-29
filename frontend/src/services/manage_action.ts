import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type ActionModel from "@/model/action_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
 


export default interface IManageAction {
    getAllActions(): Promise<ActionModel[] | null>;
  }
  
  export class ManageAction implements IManageAction {

    private static _instance: ManageAction;
    http: AxiosInstance;
  
    private constructor() {
      this.http = http();
    }

  
    public static getInstance(): ManageAction {
      if (!ManageAction._instance) {
        ManageAction._instance = new ManageAction();
      }
      return ManageAction._instance;
    }
  
    path: string = "/manage-actions";
  
    rules = ref<ActionModel[]>([]); 
  
    async getAllActions(): Promise<ActionModel[] | null> {
      try {
        const res = await this.http.get(this.path);
        this.rules.value = res.data.data as ActionModel[];
        return res.data.data;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }

}