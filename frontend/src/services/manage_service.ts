import axiosCatch from "@/helpers/axios_catch";
import type ServiceModel from "@/model/service_model";
import type { AxiosError } from "axios";
import IAxiosService from "../helpers/axios_service";
import type { StandartRepsonse } from "../model/response_model";

export default interface IManageService extends IAxiosService {
  createService(
    name: string,
    description: string,
    authUrl: string,
    clientId: string,
    clientSecret: string
  ): Promise<StandartRepsonse<Object>>;
  getService(serviceId: string): Promise<StandartRepsonse<ServiceModel>>;
  updateService(manage: ServiceModel): Promise<StandartRepsonse<ServiceModel>>;
  deleteService(serviceId: string): Promise<StandartRepsonse<ServiceModel>>;
  getAllServices(): Promise<StandartRepsonse<ServiceModel[] | Object>>;
}

export default class ManageService
  extends IAxiosService
  implements IManageService
{
  path: string = "/manageServices";

  constructor() {
    super();
  }

  async createService(
    name: string,
    description: string,
    authURL: string,
    clientId: string,
    clientSecret: string
  ): Promise<StandartRepsonse<Object>> {
    const body = {
      name: name,
      description: description,
      authURL: authURL,
      clientId: clientId,
      clientSecret: clientSecret,
    };
    try {
      const res = await this.http.post(this.path, body);
      return res.data as StandartRepsonse<ServiceModel>;
    } catch (error) {
      return axiosCatch(error);
    }
  }
  getService(serviceId: string): Promise<StandartRepsonse<ServiceModel>> {
    throw new Error("Method not implemented.");
  }

  async updateService(
    manage: ServiceModel
  ): Promise<StandartRepsonse<ServiceModel | Object>> {
    try {
      const res = await this.http.put(this.path, manage);
      return res.data as StandartRepsonse<ServiceModel>;
    } catch (error) {
      return axiosCatch(error);
    }
  }
  async deleteService(serviceId: string): Promise<StandartRepsonse<Object>> {
    try {
      const res = await this.http.delete(this.path, {
        params: { serviceID: serviceId },
      });
      console.log(res);
      return res.data as StandartRepsonse<Object>;
    } catch (error) {
      return axiosCatch(error);
    }
  }
  async getAllServices(): Promise<StandartRepsonse<ServiceModel[] | Object>> {
    try {
      const res = await this.http.get(this.path);
      return res.data as StandartRepsonse<ServiceModel[]>;
    } catch (error) {
      return axiosCatch(error);
    }
  }
}
