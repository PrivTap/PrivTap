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
    manageServiceStub.getAllServices.resolves(
      [serviceModel]
    );
    const res = await manageServiceStub.getAllServices();
    expect(res).not.toBe(null);
    expect(res?.length).toBe(1);
    expect(res).toBeInstanceOf(Array<ServiceModel>);
  });

  /// Test deleteService
  test("should return a list of service after delete", async () => {
    manageServiceStub.deleteService.resolves([]);
    const res = await manageServiceStub.deleteService("Test Service id");
    expect(res).to.empty;
  });

  /// Test updateService
  test("should return the updated service", async () => {
    manageServiceStub.updateService.resolves(
      serviceModel
    );
    const res = await manageServiceStub.updateService(
      "Test Service id",
      "Test Service Name",
      "Test Description",
      "Test Auth Server",
      "Test Client Id",
      "Tes Client Sercret",
    );
    expect(res).not.toBe(null);
    expect(res).toBeInstanceOf(ServiceModel);
  });
});
