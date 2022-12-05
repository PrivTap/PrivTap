import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type ServiceModel from "@/model/service_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export interface IManageService {
  createService(
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    triggerUrl: string
  ): Promise<ServiceModel | null>;
  getServiceById(serviceId: string): Promise<ServiceModel | null>;
  updateService(servciceId: string,
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    triggerUrl: string
  ): Promise<ServiceModel | null>;
  deleteService(serviceId: string): Promise<ServiceModel[] | null>;
  getAllServices(): Promise<ServiceModel[] | null>;
}

export class ManageService
  implements IManageService {

  /// Singelton intance
  private static _instance: ManageService;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.http = http();
  }

  /**
  * The static method that controls the access to the singleton instance.
  * This implementation let you subclass the Singleton class while keeping
  * just one instance of each subclass around.
  */
  static get getInstance(): ManageService {
    if (!ManageService._instance) {
      ManageService._instance = new ManageService();
    }

    return ManageService._instance;
  }


  /*
  * Axios instance
  */
  http: AxiosInstance;

  /**
   * Path to the api
   */
  path: string = "/manage-services";

  /**
   *  Services to reference 
   */
  services = ref<ServiceModel[]>([]);

  async getAllServices(): Promise<ServiceModel[] | null> {
    try {
      const res = await this.http.get(this.path);
      this.services.value = res.data.data as ServiceModel[];
      return res.data.data;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async getServiceById(serviceId: string): Promise<ServiceModel | null> {
    try {
      const res = await this.http.get(this.path, { params: { serviceId } });
      return res.data.data as ServiceModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async createService(
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    triggerUrl: string
  ): Promise<ServiceModel | null> {
    const body = {
      "name": name,
      "description": description,
      "authServer": authServer,
      "clientId": clientId,
      "clientSecret": clientSecret,
      "triggerNotificationServer": triggerUrl,
    };
    try {
      const res = await this.http.post(this.path, body);
      useToast().success("Service created");
      return res.data.data as ServiceModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }



  async updateService(
    serviceId: string,
    name: string,
    description: string,
    authServer: string,
    clientId: string,
    clientSecret: string,
    triggerUrl: string
  ): Promise<ServiceModel | null> {
    try {
      const body = {
        "serviceId": serviceId,
        "name": name,
        "description": description,
        "authServer": authServer,
        "clientId": clientId,
        "clientSecret": clientSecret,
        "triggerNotificationServer": triggerUrl,
      }
      const res = await this.http.put(this.path, body);
      useToast().success("Service updated");
      return res.data.data as ServiceModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }
  async deleteService(serviceId: string): Promise<Array<ServiceModel> | null> {
    try {
      const body = { "serviceId": serviceId }
      const res = await this.http.delete(this.path, { data: body });
      this.services.value = this.services.value.filter((service) => service._id !== serviceId);
      useToast().success("Service deleted");
      return this.services.value;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }
}
