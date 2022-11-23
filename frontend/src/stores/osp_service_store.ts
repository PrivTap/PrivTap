import type ServiceModel from "@/model/service_model";
import { defineStore } from "pinia";
import { ref, type Ref, reactive, getCurrentInstance, onMounted } from "vue";
import ManageService from "@/services/manage_service";
import { useToast } from "vue-toastification";
import type { StandartRepsonse } from "@/model/response_model";
import axiosCatch from "@/helpers/axios_catch";
import router from "@/router/router";
import RoutingPath from "@/router/routing_path";

export default interface IOspServiceStoreState {
  services: Ref<ServiceModel[] | []>;
  manageService: ManageService;
}

export const useOspServiceStore = defineStore("ospServiceStore", {
  state: (): IOspServiceStoreState => ({
    services: ref<ServiceModel[]>([]),
    manageService: new ManageService(),
  }),
  actions: {
    async postCallService(name: string, description: string, authUrl: string, clientId: string, clientSecret: string) {
      const toast = useToast();
      try {
        const response = await this.manageService.createService(name, description, authUrl, clientId, clientSecret);
        if (response) {
          toast.success("Service created successfully");
          this.addService(response.data as ServiceModel);
          router.push(RoutingPath.OSP_PERSONAL_PAGE);
        }
      } catch (error) {
        axiosCatch(error);
      }
    },
    async updateCallService(service: ServiceModel) {
      const toast = useToast();
      try {
        const response = await this.manageService.updateService(service);
        if (response) {
          toast.success("Service updated successfully");
          this.updateService(response.data as ServiceModel);
        }
      } catch (error) {
        axiosCatch(error);
      }
    },
    async deleteCallService(service: ServiceModel) {
      const toast = useToast();
      try {
        const response = await this.manageService.deleteService(service._id);
        if (response) {
          toast.success("Service deleted successfully");
          this.removeService(service._id);
        }
      } catch (error) {
        axiosCatch(error);
      }
    },
    async getServices() {
      try {
        console.log("getServices");
        const response = await this.manageService.getAllServices();
        if (response.status) {
          this.services = response.data as Array<ServiceModel>;
        }
      } catch (error) {
        axiosCatch(error);
      }
    },
    removeService(serviceId: string) {
      this.services = this.services.filter(
        (service) => service._id !== serviceId
      );
    },
    addService(newService: ServiceModel) {
      this.services = [...this.services, newService];
    },
    updateService(updatedService: ServiceModel) {
      this.services = this.services.map((oldService) => {
        if (oldService._id === updatedService._id) {
          return updatedService;
        }
        return oldService;
      });
    },
  },
});

// export const useOspServiceStore = defineStore("osp_service_store", () => {
//   let services = ref<Array<ServiceModel> | []>([]);
//   const manageService = new ManageService();
//   const toast = useToast();

//   async function getServices() {
//     const res = await new ManageService().getAllServices();
//     if (res.status) {
//       setServices(res.data as ServiceModel[]);
//     }
//   }

//   if (getCurrentInstance()) {
//     console.log("manage service mounted");
//     onMounted(async () => {
//       const res = await new ManageService().getAllServices();
//       if (res.status) {
//         setServices(res.data as ServiceModel[]);
//       }
//     });
//   }

//   const setServices = (newServices: Array<ServiceModel>) => {
//     services.value = newServices;
//   };
//   const deleteService = async (serviceId: string) => {
//     const res = await manageService.deleteService(serviceId);
//     if (res.status) {
//       services.value = services.value.filter(
//         (service) => service._id !== serviceId
//       );
//       toast.success("Service deleted successfully");
//       return;
//     }
//     toast.error(res.message);
//     return;
//   };

//   async function addService(
//     name: string,
//     description: string,
//     authUrl: string,
//     clientID: string,
//     clientSecret: string
//   ) {
//     const res = await manageService.createService(
//       name,
//       description,
//       authUrl,
//       clientID,
//       clientSecret
//     );
//     if (res.status) {
//       const newService = res.data as ServiceModel;
//       services.value = [...services.value, newService];
//       if (res) {
//         useToast().success("Service added successfully");
//         return true;
//       }
//     }
//     useToast().error(res.message);
//     return false;
//   }

//   const updateService = (service: ServiceModel) => {
//     services.value = services.value.map((oldService) => {
//       if (oldService._id === service._id) {
//         return service;
//       }
//       return oldService;
//     });
//   };

//   return {
//     services,
//     setServices,
//     deleteService,
//     addService,
//     updateService,
//     getServices,
//   };
// });
