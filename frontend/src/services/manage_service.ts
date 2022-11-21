import type ServiceModel from "@/model/service_model";
import IAxiosService from "../helpers/axios_service";
import type { StandartRepsonse } from "../model/response_model";

export default interface IManageService extends IAxiosService {
  createService(
    name: string,
    description: string,
    auth_server: string
  ): Promise<StandartRepsonse<ServiceModel>>;
  getService(serviceId: string): Promise<StandartRepsonse<ServiceModel>>;
  updateService(manage: ServiceModel): Promise<StandartRepsonse<ServiceModel>>;
  deleteService(serviceId: string): Promise<StandartRepsonse<ServiceModel>>;
  getAllServices(): Promise<StandartRepsonse<Array<ServiceModel>>>;
}

class ManageService extends IAxiosService implements IManageService {
  constructor() {
    super();
  }

  createService(
    name: string,
    description: string,
    auth_server: string
  ): Promise<StandartRepsonse<ServiceModel>> {
    throw new Error("Method not implemented.");
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
  getAllServices(): Promise<StandartRepsonse<ServiceModel[]>> {
    throw new Error("Method not implemented.");
  }
}
