// import { setActivePinia, createPinia, Store } from "pinia";
// import { useOspServiceStore } from "../../src/stores/osp_service_store";
// import ServiceModel from "../../src/model/service_model";
// import { describe, expect, it, beforeEach, afterEach } from "vitest";

// describe("Manage Service Store Test", () => {
//   let testServiceModel = new ServiceModel(
//     "id",
//     "name",
//     "description",
//     "creator",
//     "url",
//     "client_id",
//     "client_secret",
//     1.0
//   );
//   beforeEach(() => {
//     // creates a fresh pinia and make it active so it's automatically picked
//     // up by any useStore() call without having to pass it to it:
//     // `useStore(pinia)`
//     setActivePinia(createPinia());
//   });

//   afterEach(() => {
//     // cleanup the pinia instance
//     setActivePinia(undefined);
//   });

//   /// Test the getServices function
//   it("Should set the services on the store", () => {
//     const ospServiceStore = useOspServiceStore();
//     expect(ospServiceStore.services).toStrictEqual([]);
//     let services = [testServiceModel, testServiceModel];
//     ospServiceStore.services = services;
//     expect(ospServiceStore.services.length).toBe(2);
//     expect(ospServiceStore.services[0]).toStrictEqual(testServiceModel);
//   });

//   /// Test add service
//   it("Should add a service on the store", () => {
//     const ospServiceStore = useOspServiceStore();
//     expect(ospServiceStore.services).toStrictEqual([]);
//     ospServiceStore.addService(testServiceModel);
//     expect(ospServiceStore.services.length).toBe(1);
//   });

//   /// Test delete service
//   it("Should delete a service", () => {
//     const ospServiceStore = useOspServiceStore();
//     let services = [testServiceModel];
//     ospServiceStore.services = services;
//     ospServiceStore.removeService(testServiceModel._id);
//     expect(ospServiceStore.services.length).toBe(0);
//   });

//   /// Test update service
//   it("Should update a service", () => {
//     const ospServiceStore = useOspServiceStore();
//     let services = [testServiceModel];
//     ospServiceStore.services = services;
//     let updatedService = testServiceModel;
//     updatedService.name = "updated name";
//     ospServiceStore.updateService(updatedService);
//     expect(ospServiceStore.services[0].name).toBe("updated name");
//   });
// });
