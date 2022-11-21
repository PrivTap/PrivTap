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

export default class ManageService extends IAxiosService implements IManageService {
  path: string = "/manageServices";

  constructor() {
    super();
  }

  async createService(
    name: string,
    description: string,
    authUrl: string,
    clientId: string,
    clientSecret: string
  ): Promise<StandartRepsonse<Object>> {
    const body = {
      name: name,
      description: description,
      authUrl: authUrl,
      clientId: clientId,
      clientSecret: clientSecret,
    };
    try {
      const res = await this.http.post(this.path, body); 
      return res.data as StandartRepsonse<ServiceModel>;
    } catch (error) {
      const err = error as AxiosError;
      if(err.response?.data) {
        return err.response?.data as StandartRepsonse<Object>;
      }
      return {
        status: false,
        message: "Somenthing went wrong..",
      } as StandartRepsonse<Object>;
    }
    
  }
  getService(serviceId: string): Promise<StandartRepsonse<ServiceModel>> {
    throw new Error("Method not implemented.");
  }

  updateService(manage: ServiceModel): Promise<StandartRepsonse<ServiceModel>> {
    throw new Error("Method not implemented.");
  }
  deleteService(serviceId: string): Promise<StandartRepsonse<ServiceModel>> {
    throw new Error("Method not implemented.");
  }
  async getAllServices(): Promise<StandartRepsonse<ServiceModel[] | Object>> {
    try {
      const res = await this.http.get(this.path); 
      return res.data as StandartRepsonse<ServiceModel[]>;
    } catch (error) {
      const err = error as AxiosError;
      if(err.response?.data) {
        return err.response?.data as StandartRepsonse<Object>;
      }
      return {
        status: false,
        message: "Somenthing went wrong..",
      } as StandartRepsonse<Object>;
    }
  }
}
