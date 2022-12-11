import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type ActionModel from "@/model/action_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";



export interface IManageAction {
  getAllActions(serviceId: string): Promise<ActionModel[]>;
  createAction(name: string, description: string, serviceId: string, permissions: string[], endpoint: string): Promise<ActionModel | null>;
  deleteAction(actionId: string): Promise<ActionModel[]>;
  updateAction(actionId: string,
    name: string,
    description: string,
    permissions: string[],
    endpoint: string): Promise<ActionModel | null>;
}

export class ManageAction implements IManageAction {

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

  async getAllActions(serviceId: string): Promise<ActionModel[]> {
    try {
      const res = await this.http.get(this.path, { params: { serviceId } });
      this.actions.value = res.data.data as ActionModel[];
      return res.data.data;
    } catch (error) {
      axiosCatch(error);
      return this.actions.value;
    }
  }

  async createAction(
    name: string,
    description: string,
    serviceId: string,
    permissions: string[],
    endpoint: string,
  ): Promise<ActionModel | null> {
    const body = {
      name: name,
      description: description,
      serviceId: serviceId,
      permissions: permissions,
      endpoint: endpoint,
    };
    try {
      const res = await this.http.post(this.path, body);
      useToast().success("Action created");
      const action = res.data.data as ActionModel;
      this.actions.value.push(action);
      return action;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async updateAction(
    actionId: string,
    name: string,
    description: string,
    permissions: string[],
    endpoint: string,
  ): Promise<ActionModel | null> {
    try {
      const body = {
        actionId: actionId,
        name: name,
        description: description,
        permissions: permissions,
        endpoint: endpoint,
      }
      const res = await this.http.put(this.path, body);
      useToast().success("Action updated");
      const updatedAction = res.data.data as ActionModel;
      this.actions.value = this.actions.value.map((action) => {
        if (action._id === updatedAction._id) {
          return updatedAction;
        }
        return action;
      });
      return updatedAction
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async deleteAction(actionId: string): Promise<ActionModel[]> {
    try {
      const body = { "actionId": actionId }
      const res = await this.http.delete(this.path, { data: body });
      this.actions.value = this.actions.value.filter((action) => action._id !== actionId);
      useToast().success("Action deleted");
      return this.actions.value;
    } catch (error) {
      axiosCatch(error);
      return this.actions.value;
    }
  }
}