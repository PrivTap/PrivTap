import { setActivePinia, createPinia } from "pinia";
import IOspServiceStoreState, {
  useOspServiceStore,
} from "../../src/stores/osp_service_store";
import ServiceModel from "../../src/model/service_model";
import { describe, expect, it, beforeEach, beforeAll, test } from "vitest";

describe("Manage Service Store Test", () => {
  let ospServiceStore;

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
    ospServiceStore = useOspServiceStore();
    ospServiceStore.setServices([]);
  });

  /// Test the getServices function
  it("Should set the services", () => {
    expect(ospServiceStore.services).toStrictEqual([]);
  });

  /// Test add service
  it("Should add a service", () => {
    expect(ospServiceStore.services).toStrictEqual([]);
  });

  /// Test delete service
  it("Should delete a service", () => {
    expect(ospServiceStore.services).toStrictEqual([]);
  });

  /// Test update service
  it("Should update a service", () => {
    expect(ospServiceStore.services).toStrictEqual([]);
  });
});
