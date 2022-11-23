import type ServiceModel from "@/model/service_model";
import { defineStore } from "pinia";
import { ref, type Ref, reactive, getCurrentInstance, onMounted } from "vue";
import ManageService from "@/services/manage_service";
import { useToast } from "vue-toastification";
import type { StandartRepsonse } from "@/model/response_model";

export default interface IOspServiceStoreState {
  services: Ref<Array<ServiceModel> | []>;
  getServices: () => void;
  setServices: (services: Array<ServiceModel>) => void;
  deleteService: (serviceId: string) => void;
  addService: (
    name: string,
    description: string,
    authUrl: string,
    clientID: string,
    clientSecret: string
  ) => void;
  updateService: (service: ServiceModel) => void;
}

export const useOspServiceStore = defineStore("osp_service_store", () => {
  let services = ref<Array<ServiceModel> | []>([]);
  const manageService = new ManageService();
  const toast = useToast();

  async function getServices() {
    const res = await new ManageService().getAllServices();
    if (res.status) {
      setServices(res.data as ServiceModel[]);
    }
  }

  if (getCurrentInstance()) {
    console.log("manage service mounted");
    onMounted(async () => {
      const res = await new ManageService().getAllServices();
      if (res.status) {
        setServices(res.data as ServiceModel[]);
      }
    });
  }


  const setServices = (newServices: Array<ServiceModel>) => {
    services.value = newServices;
  };
  const deleteService = async (serviceId: string) => {
    const res = await manageService.deleteService(serviceId);
    if (res.status) {
      services.value = services.value.filter(
        (service) => service._id !== serviceId
      );
      toast.success("Service deleted successfully");
      return;
    }
    toast.error(res.message);
    return;
  };

  async function addService(
    name: string,
    description: string,
    authUrl: string,
    clientID: string,
    clientSecret: string
  ) {
    const res = await manageService.createService(
      name,
      description,
      authUrl,
      clientID,
      clientSecret
    );
    if (res.status) {
      const newService = res.data as ServiceModel;
      services.value = [...services.value, newService];
      if (res) {
        useToast().success("Service added successfully");
        return true;
      }
    }
    useToast().error(res.message);
    return false;
  }

  const updateService = (service: ServiceModel) => {
    services.value = services.value.map((oldService) => {
      if (oldService._id === service._id) {
        return service;
      }
      return oldService;
    });
  };

  return {
    services,
    setServices,
    deleteService,
    addService,
    updateService,
    getServices,
  };
});
