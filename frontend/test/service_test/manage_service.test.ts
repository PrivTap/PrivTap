import { afterEach, beforeEach, describe, test } from "vitest";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import { use, expect } from "chai";
import axiosInstance from "../../src/helpers/axios_service";
import manageService from "../../src/controllers/manage_service";
import ServiceModel from "../../src/model/service_model";
import sinonChai from "sinon-chai";

use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Manage Service Test", () => {
  let getStub: SinonStub;
  let postStub: SinonStub;
  let putStub: SinonStub;
  let deleteStub: SinonStub;
  const testServiceModel: ServiceModel = new ServiceModel(
    "Test Service id",
    "Test Service name",
    "Service description",
    "creator",
  );
  beforeEach(() => {
    getStub = sandbox.stub(axiosInstance, "get");
    postStub = sandbox.stub(axiosInstance, "post");
    putStub = sandbox.stub(axiosInstance, "put");
    deleteStub = sandbox.stub(axiosInstance, "delete");
  });
  afterEach(async () => {
    sandbox.restore();
    manageService.getRef().value = [];
  })

  //TEST GetServices
  test("Should put in the ref all the Services", async () => {
    getStub.resolves({ data: { data: [testServiceModel] } })
    await manageService.getAllServices();
    expect(manageService.getRef().value).to.be.eql([testServiceModel]);
  });
  test("Should put nothing in the ref value if the gets failed", async () => {
    getStub.resolves(null);
    await manageService.getAllServices();
    expect(manageService.getRef().value).to.be.eql([]);
  })
  //TEST CreateServices
  test("Should put the created Service in the ref array", async () => {
    postStub.resolves({ data: { data: testServiceModel } })
    await manageService.createService(testServiceModel.name, testServiceModel.description,
      testServiceModel.baseUrl!, testServiceModel.authPath!, testServiceModel.tokenPath!, testServiceModel.clientId!, testServiceModel.clientSecret!)
    expect(manageService.getRef().value).to.be.eql([testServiceModel]);
  });
  test("Should put nothing in the ref value if the gets failed", async () => {
    postStub.resolves(null);
    await manageService.createService(testServiceModel.name, testServiceModel.description,
      testServiceModel.baseUrl!, testServiceModel.authPath!, testServiceModel.tokenPath!, testServiceModel.clientId!, testServiceModel.clientSecret!)
    expect(manageService.getRef().value).to.be.eql([]);
  })

  //TEST UpdateService
  test("Should change the updated Service in the ref array", async () => {
    manageService.getRef().value = [testServiceModel];
    const updatedService = new ServiceModel(
      "Test Service id",
      "Test Service name changed",
      "Service description changed",
      "changedCreator",
    )
    putStub.resolves({ data: { data: updatedService } });
    await manageService.updateService(updatedService._id, updatedService.name, updatedService.description, updatedService.baseUrl!, updatedService.authPath!, updatedService.tokenPath!,
      updatedService.clientId!, updatedService.clientSecret!)
    expect(manageService.getRef().value).to.be.eql([updatedService]);
  })
  test("Should not change the updated Service in the ref array if it fails", async () => {
    manageService.getRef().value = [testServiceModel];
    const updatedService = new ServiceModel(
      "Test Service id",
      "Test Service name changed",
      "Service description changed",
      "changedCreator",
    )
    putStub.resolves(null);
    await manageService.updateService(updatedService._id, updatedService.name, updatedService.description, updatedService.baseUrl!, updatedService.authPath!, updatedService.tokenPath!,
      updatedService.clientId!, updatedService.clientSecret!)
    expect(manageService.getRef().value).to.be.eql([testServiceModel]);

  })

  //TEST DeleteService
  test("Should delete the Service in the ref value", async () => {
    manageService.getRef().value = [testServiceModel];
    await manageService.deleteService(testServiceModel._id);
    expect(manageService.getRef().value).to.be.eql([]);
  });

});

