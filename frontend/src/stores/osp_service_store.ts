import type ServiceModel from "@/model/service_model";
import { defineStore } from "pinia";
import { ref, type Ref, reactive, getCurrentInstance, onMounted } from "vue";
import ManageService from "@/services/manage_service";

export default interface IOspServiceStoreState {
  services: Ref<Array<ServiceModel> | []>;
  setServices: (services: Array<ServiceModel>) => void;
  deleteService: (serviceId: string) => void;
  addService: (service: ServiceModel) => void;
  updateService: (service: ServiceModel) => void;
}

export const useOspServiceStore = defineStore("osp_service_store", () => {

  if (getCurrentInstance()) {
    console.log("manage service mounted");
    onMounted(async () => {
      const res = await new ManageService().getAllServices();
      if (res.status) {
        setServices(res.data as ServiceModel[]);
      }
    });
  }

  let services = ref<Array<ServiceModel> | []>([]);
  const setServices = (newServices: Array<ServiceModel>) => {
    services.value = newServices;
  };
  const deleteService = (serviceId: string) => {
    services.value = services.value.filter(
      (service) => service._id !== serviceId
    );
  };
  const addService = (service: ServiceModel) => {
    services.value = [...services.value, service];
  };

  const updateService = (service: ServiceModel) => {
    services.value = services.value.map((oldService) => {
      if (oldService._id === service._id) {
        return service;
      }
      return oldService;
    });
  };

  return { services, setServices, deleteService, addService, updateService };
});
