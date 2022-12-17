import {afterEach, beforeEach, describe, test} from "vitest";
import {SinonStub} from "sinon";
import * as sinon from "sinon";
import {use, expect} from "chai";
import sinonChai = require("sinon-chai");
import axiosInstance from "../../src/helpers/axios_service";
import manageAction from "../../src/controllers/manage_action";
import ActionModel from "../../src/model/Action_model";


use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Manage Action Test", () => {
  let getStub: SinonStub;
  let postStub: SinonStub;
  let putStub: SinonStub;
  let deleteStub: SinonStub;
  const testActionModel: ActionModel = new ActionModel(
      "Test Action id",
      "Test Action name",
      "Action description",
      ["String1", "String2"],
  );
  const serviceId = "test Service id";
  beforeEach(() => {
    getStub = sandbox.stub(axiosInstance, "get");
    postStub = sandbox.stub(axiosInstance, "post");
    putStub = sandbox.stub(axiosInstance, "put");
    deleteStub = sandbox.stub(axiosInstance, "delete");
  });
  afterEach(async () => {
    sandbox.restore();
    manageAction.getRef().value=[];
  })

  //TEST GetActions
  test("Should put in the ref all the actions", async () => {
    getStub.resolves({data: {data: [testActionModel]}})
    await manageAction.getAllActions(testActionModel.serviceId);
    expect(manageAction.getRef().value).to.be.eql([testActionModel]);
  });
  test("Should put nothing in the ref value if the gets failed", async()=>{
    getStub.resolves(null);
    await manageAction.getAllActions(testActionModel.serviceId);
    expect(manageAction.getRef().value).to.be.eql([]);
  })
  //TEST CreateActions
  test("Should put the created Action in the ref array", async () => {
    postStub.resolves({data: {data: testActionModel}})
    await manageAction.createAction(testActionModel.name, testActionModel.description,
        serviceId, testActionModel.permissions, undefined)
    expect(manageAction.getRef().value).to.be.eql([testActionModel]);
  });
  test("Should put nothing in the ref value if the gets failed", async()=>{
    postStub.resolves(null);
    await manageAction.createAction(testActionModel.name, testActionModel.description,
        serviceId, testActionModel.permissions, undefined)
    expect(manageAction.getRef().value).to.be.eql([]);
  })

  //TEST UpdateAction
  test("Should change the updated Action in the ref array", async()=>{
    manageAction.getRef().value= [testActionModel];
    const updatedAction= new ActionModel(
        "Test Action id",
        "Test Action name changed",
        "Action description changed",
        ["String1", "String2", "added String"],
    )
    putStub.resolves({data: {data:updatedAction}});
    await manageAction.updateAction(updatedAction._id, updatedAction.name, updatedAction.description,
        updatedAction.permissions, updatedAction.endpoint)
    expect(manageAction.getRef().value).to.be.eql([updatedAction]);
  })
  test("Should not change the updated Action in the ref array if it fails", async()=>{
    manageAction.getRef().value= [testActionModel];
    const updatedAction= new ActionModel(
        "Test Action id",
        "Test Action name changed",
        "Action description changed",
        ["String1", "String2", "added String"],
    )
    putStub.resolves(null);
    await manageAction.updateAction(updatedAction._id, updatedAction.name, updatedAction.description,
        updatedAction.permissions, updatedAction.endpoint)
    expect(manageAction.getRef().value).to.be.eql([testActionModel]);

  })

  //TEST DeleteAction
  test("Should delete the Action in the ref value", async () => {
    manageAction.getRef().value= [testActionModel];
    await manageAction.deleteAction(testActionModel._id);
    expect(manageAction.getRef().value).to.be.eql([]);
  });

});
