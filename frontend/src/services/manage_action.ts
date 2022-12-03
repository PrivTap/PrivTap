import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type ActionModel from "@/model/action_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";
 


export interface IManageAction {

  createAction(
    actionId: string,
    name: string,
    description: string,
    serviceName: string,
    serviceId: string,
  ): Promise<ActionModel | null>;

  getActionById(
    actionId: string
    ): Promise<ActionModel | null>;

  updateAction(
    actionId: string,
    name: string,
    description: string,
    serviceName: string,
    serviceId: string,
    ): Promise<ActionModel | null>;

  deleteAction(
    actionId: string
    ): Promise<ActionModel[] | null>;

  getAllActions(

    ): Promise<ActionModel[] | null>;

  }
  
  export default class ManageAction
   implements IManageAction {
  

    private static _instance: ManageAction;
    
    http: AxiosInstance; 
    private constructor() {
      this.http = http();
    }

  
     static get getInstance(): ManageAction {
      if (!ManageAction._instance) {
        ManageAction._instance = new ManageAction();
      }
      return ManageAction._instance;
    }
 

    path: string = "/manage-actions";
  
    actions = ref<ActionModel[]>([]); 
  
    async getAllActions(): Promise<ActionModel[] | null> {
      try {
        const res = await this.http.get(this.path);
        this.actions.value = res.data.data as ActionModel[];
        return res.data.data;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }


    async getActionById(actionId: string): Promise<ActionModel | null> {
      try {
        const res = await this.http.get(this.path, { params: { actionId } });
        return res.data.data as ActionModel;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }

    async createAction(
      actionId: string,
      name: string,
      description: string,
      serviceName: string,
      serviceId: string,
    ): Promise<ActionModel | null> {
      const body = {
        actionId: actionId,
        name: name,
        description: description,
        serviceName: serviceName,
        serviceId: serviceId,
      };
      try {
        const res = await this.http.post(this.path, body);
        useToast().success("Action created");
        return res.data.data as ActionModel;
      } catch (error) {
        axiosCatch(error);
        return null;
      }
    }
  
    
  async updateAction(
      actionId: string,
      name: string,
      description: string,
      serviceName: string,
      serviceId: string,
  ): Promise<ActionModel | null> {
    try {
      const body = {
        actionId: actionId,
        name: name,
        description: description,
        serviceName: serviceName,
        serviceId: serviceId,
      }
      const res = await this.http.put(this.path, body);
      useToast().success("Action updated");
      return res.data.data as ActionModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }
  

  async deleteAction(actionId: string): Promise<Array<ActionModel> | null> {
    try {
      const body = { "actionId": actionId }
      const res = await this.http.delete(this.path, { data: body });
      this.actions.value = this.actions.value.filter((action) => action._id !== actionId);
      useToast().success("Action deleted");
      return this.actions.value;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }
}