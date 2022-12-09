import type ServiceModel from "@/model/service_model";
import { ref, type Ref } from "vue";
import { GenericController } from "./generic_controller";

const path = "/manage-services";
let services = ref<ServiceModel[]>([]);

export interface IManageService {
  createService(
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    triggerUrl: string
  ): Promise<void>;
  getServiceById(serviceId: string): Promise<ServiceModel | null>;
  updateService(servciceId: string,
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    triggerUrl: string
  ): Promise<ServiceModel | null>;
  deleteService(serviceId: string): Promise<void>;
  getAllServices(): Promise<void>;
}

class ManageService extends GenericController<ServiceModel[]> implements IManageService {

  getRef(): Ref<ServiceModel[]> {
    return services;
  }

  async getAllServices(): Promise<void> {
    const res = await super.get<ServiceModel[]>(path);
    services.value = res;
  }

  async getServiceById(serviceId: string): Promise<ServiceModel | null> {
    return await super.get<ServiceModel | null>(path, { query: { serviceId } });
  }

  async createService(
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
  ): Promise<void> {
    const body = {
      "name": name,
      "description": description,
      "authServer": authServer,
      "clientId": clientId,
      "clientSecret": clientSecret,
    };
    const res = await super.post<ServiceModel>(path, { body: body, message: "Service created" });
    services.value.push(res);
  }

  async updateService(
    serviceId: string,
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
  ): Promise<ServiceModel | null> {
    const body = {
      "serviceId": serviceId,
      "name": name,
      "description": description,
      "authServer": authServer,
      "clientId": clientId,
      "clientSecret": clientSecret,
    }
    return await super.put<ServiceModel | null>(path, { body: body, message: "Service updated" });
  }

  async deleteService(serviceId: string): Promise<void> {
    const body = { "serviceId": serviceId }
    const res = await super.delete(path, { body: body, message: "Service deleted" });
    services.value = services.value.filter((service) => service._id !== serviceId);
  }
}

export const manage_service = new ManageService();
