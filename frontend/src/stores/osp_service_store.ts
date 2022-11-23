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
  persist: {
    enabled: true,
  },
  state: () => ({
    services: ref<ServiceModel[]>([]),
    manageService: new ManageService(),
  }),
  actions: {
    async postCallService(
      name: string,
      description: string,
      authUrl: string,
      clientId: string,
      clientSecret: string
    ) {
      const toast = useToast();
      try {
        const response = await this.manageService.createService(
          name,
          description,
          authUrl,
          clientId,
          clientSecret
        );
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
        console.log(response);
        if (response.status) {
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
