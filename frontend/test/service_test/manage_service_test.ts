import { StubbedInstance, stubInterface } from "ts-sinon";
import { beforeAll, describe, expect, test } from "vitest";
import IManageService from "../../src/services/manage_service";
import ServiceModel from "../../src/model/service_model";

describe("Manage Service Tests", () => {
  let manageServiceStub: StubbedInstance<IManageService>;
  let serviceModel: ServiceModel = new ServiceModel(
    "Test Service id",
    "Test Service Name",
    "Test Description",
    "Test Creator",
    "Test Auth Server",
    "Test Client Id",
    "Test ClientSecret",
    0,
  );
  beforeAll(() => {
    manageServiceStub = stubInterface<IManageService>();
  });

  /// Test createService
  test("should return a the created service", async () => {
    manageServiceStub.createService.resolves({
      status: true,
      message: "",
      data: serviceModel,
    });
    const res = await manageServiceStub.createService(
      "Test Service Name",
      "Test Description",
      "Test Auth Server",
      "Test Client Id",
      "Tes Client Sercret",
    );
    expect(res.status).toBe(true);
    expect(res.message).to.empty;
    expect(res.data).toBeInstanceOf(ServiceModel);
  });

  /// Test getAllServices
  test("should return a list of defined service", async () => {
    manageServiceStub.getAllServices.resolves({
      status: true,
      message: "",
      data: [serviceModel],
    });
    const res = await manageServiceStub.getAllServices();
    expect(res.status).toBe(true);
    expect(res.message).to.empty;
    expect(res.data).toBeInstanceOf(Array<ServiceModel>);
  });

  /// Test deleteService
  test("should return a list of defined service", async () => {
    manageServiceStub.deleteService.resolves({
      status: true,
      message: "Service deleted correctly",
    });
    const res = await manageServiceStub.deleteService("Test Service id");
    expect(res.status).toBe(true);
    expect(res.message).toBe("Service deleted correctly");
  });

  /// Test updateService
  test("should return a list of defined service", async () => {
    manageServiceStub.updateService.resolves({
      status: true,
      message: "Service updated correctly",
      data: serviceModel,
    });
    const res = await manageServiceStub.updateService(serviceModel);
    expect(res.status).toBe(true);
    expect(res.message).toBe("Service updated correctly");
    expect(res.data).toBeInstanceOf(ServiceModel);
  });
});
