import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { ManageService } from "../../src/services/manage_service";
import ServiceModel from "../../src/model/service_model";
import MockAdapter from "axios-mock-adapter";

describe("Manage Service Tests", () => {
  let mock: MockAdapter;
  const _manageService = ManageService.getInstance;
  let testServiceModel: ServiceModel = new ServiceModel(
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
    mock = new MockAdapter(_manageService.http);
  });

  beforeEach(() => {
    mock.reset();
  });


  /// Test createService
  test("should return a the created service", async () => {
    mock.onPost(_manageService.path).reply(200, { data: testServiceModel });
    const res = await _manageService.createService(
      testServiceModel.name,
      testServiceModel.description,
      testServiceModel.authServer,
      testServiceModel.clientId,
      testServiceModel.clientSecret,
    );
    expect(res.name).toEqual(testServiceModel.name);
  });

  /// Test getAllServices
  test("should return a list of defined service", async () => {
    mock.onGet(_manageService.path).reply(200, { data: [testServiceModel] });
    const res = await _manageService.getAllServices();
    expect(res).toEqual([testServiceModel]);
  });

  /// Test getService by Id
  test("should return the service with the passed id", async () => {
    mock.onGet(_manageService.path, { params: { "serviceId": testServiceModel._id } }).reply(200, {
      data: testServiceModel
    }
    );
    const res = await _manageService.getServiceById(testServiceModel._id);
    expect(res.name).toBe(testServiceModel.name);
  });

  /// Test deleteService
  test("should return a list of service after delete", async () => {
    mock.onDelete(_manageService.path).reply(200, { data: [] });
    const res = await _manageService.deleteService("Test Service id");
    expect(res).to.empty;
  });

  /// Test updateService
  test("should return the updated service", async () => {
    testServiceModel.name = "Updated Service Name";
    mock.onPut(_manageService.path).reply(200, { data: testServiceModel });
    const res: ServiceModel = await _manageService.updateService(
      testServiceModel._id,
      "Updated Service Name",
      testServiceModel.description,
      testServiceModel.authServer,
      testServiceModel.clientId,
      testServiceModel.clientSecret,
    );
    expect(res).not.toBe(null);
    expect(res.name).toEqual("Updated Service Name");
  });
});
