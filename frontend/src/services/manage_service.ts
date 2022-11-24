import axiosCatch from "@/helpers/axios_catch";
import type ServiceModel from "@/model/service_model";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import IAxiosService from "../helpers/axios_service";

export default interface IManageService extends IAxiosService {
  createService(
    name: string,
    description: string,
    authUrl: string,
    clientId: string,
    clientSecret: string
  ): Promise<ServiceModel | null>;
  getServiceById(serviceId: string): Promise<ServiceModel | null>;
  updateService(manage: ServiceModel): Promise<ServiceModel | null>;
  deleteService(serviceId: string): Promise<void>;
  getAllServices(): Promise<ServiceModel[] | null>;
}

export class ManageService
  extends IAxiosService
  implements IManageService {

  /// Singelton intance
  private static _instance: ManageService;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    super();
  }

  /**
  * The static method that controls the access to the singleton instance.
  * This implementation let you subclass the Singleton class while keeping
  * just one instance of each subclass around.
  */
  public static getInstance(): ManageService {
    if (!ManageService._instance) {
      ManageService._instance = new ManageService();
    }

    return ManageService._instance;
  }

  /**
   * Path to the api
   */
  path: string = "/manageServices";

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

  async createService(
    name: string,
    description: string,
    authURL: string,
    clientId: string,
    clientSecret: string
  ): Promise<ServiceModel | null> {
    const body = {
      name: name,
      description: description,
      authURL: authURL,
      clientId: clientId,
      clientSecret: clientSecret,
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

  async getServiceById(serviceId: string): Promise<ServiceModel | null> {
    try {
      const res = await this.http.get(this.path, { params: { serviceId } });
      return res.data.data as ServiceModel;
    } catch (error) {
      const err = axiosCatch(error);
      return null;
    }
  }

  async updateService(
    manage: ServiceModel
  ): Promise<ServiceModel | null> {
    try {
      const res = await this.http.put(this.path, manage);
      useToast().success("Service updated");
      return res.data.data as ServiceModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }
  async deleteService(serviceId: string): Promise<void> {
    try {
      const res = await this.http.delete(this.path, {
        params: { serviceID: serviceId },
      });
      useToast().success("Service deleted");
    } catch (error) {
      axiosCatch(error);
    }
  }
}
