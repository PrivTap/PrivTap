import type ServiceModel from "@/model/service_model";
import {ref, type Ref} from "vue";
import {GenericController} from "./generic_controller";

const path = "/manage-services";
let services = ref<ServiceModel[]>([]);

export interface IManageService {
    createService(
        name: string,
        description: string,
        baseUrl: string,
        authPath: string,
        tokenPath: string,
        clientId: string,
        clientSecret: string,
        triggerUrl: string,
        triggerNotificationServer?:string
    ): Promise<void>;

    getServiceById(serviceId: string): Promise<ServiceModel | null>;

    updateService(serviceId: string,
                  name: string,
                  description: string,
                  baseUrl: string,
                  authPath: string,
                  tokenPath: string,
                  clientId: string,
                  clientSecret: string,
                  triggerUrl: string,
                  triggerNotificationServer?:string
    ): Promise<void>;

    deleteService(serviceId: string): Promise<void>;

    getAllServices(): Promise<void>;
}

class ManageService extends GenericController<ServiceModel[]> implements IManageService {

    getRef(): Ref<ServiceModel[]> {
        return services;
    }

    async getAllServices(): Promise<void> {
        const res = await super.get<ServiceModel[]>(path);
        services.value = !!res ? res : [];
    }

    async getServiceById(serviceId: string): Promise<ServiceModel | null> {
        return await super.get<ServiceModel | null>(path, {query: {serviceId}});
    }

    async createService(
        name: string,
        description: string,
        baseUrl: string,
        authPath: string,
        tokenPath: string,
        clientId: string,
        clientSecret: string,
        triggerNotificationServer?:string
    ): Promise<void> {
        const body = {
            "name": name,
            "description": description,
            "baseUrl": baseUrl,
            "authPath": authPath,
            "tokenPath": tokenPath,
            "clientId": clientId,
            "clientSecret": clientSecret,
            triggerNotificationServer
        };
        const res = await super.post<ServiceModel>(path, {body: body, message: "Service created"});
        if (res != null)
            services.value.push(res);
    }

    async updateService(
        serviceId: string,
        name: string,
        description: string,
        baseUrl: string,
        authPath: string,
        tokenPath: string,
        clientId: string,
        clientSecret: string,
        triggerNotificationServer?: string
    ): Promise<void> {
        const body = {
            "serviceId": serviceId,
            "name": name,
            "description": description,
            "baseUrl": baseUrl,
            "authPath": authPath,
            "tokenPath": tokenPath,
            "clientId": clientId,
            "clientSecret": clientSecret,
            triggerNotificationServer
        }
        const res = await super.put<ServiceModel>(path, {body: body, message: "Service updated"});
        if (res != null) {
            services.value = services.value.map((service) => {
                if (service._id === res._id) {
                    return res;
                }
                return service;
            });
        }
    }

    async deleteService(serviceId: string): Promise<void> {
        const body = {"serviceId": serviceId}
        await super.delete(path, {body: body, message: "Service deleted"});
        services.value = services.value.filter((service) => service._id !== serviceId);
    }
}

export default new ManageService();
