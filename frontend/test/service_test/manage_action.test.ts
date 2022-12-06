import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { ManageAction } from "../../src/services/manage_action";
import ActionModel from "../../src/model/action_model";
import MockAdapter from "axios-mock-adapter";

describe("Manage Action Test", () => {
  let mock: MockAdapter;
  const _manageAction = ManageAction.getInstance;
  let testActionModel: ActionModel = new ActionModel(
    "Test Action id",
    "Test Action name",
    "Test Description",
    "Test Service name",
    "Test Service id",
  );


  beforeAll(() => {
    mock = new MockAdapter(_manageAction.http);
  });

  beforeEach(() => {
    mock.reset();
  });


  test("should return a the created action", async () => {
    mock.onPost(_manageAction.path).reply(200, { data: testActionModel });
    const res = await _manageAction.createAction(
      testActionModel._id,
      testActionModel.name,
      testActionModel.description,
      testActionModel.serviceName,
      testActionModel.serviceId,
    );
    expect(res.name).toEqual(testActionModel.name);
  });

  test("should return a list of actions", async () => {
    mock.onGet(_manageAction.path).reply(200, { data: [testActionModel] });
    const res = await _manageAction.getAllActions();
    expect(res).toEqual([testActionModel]);
  });

  test("should return an action with the passed id", async () => {
    mock.onGet(_manageAction.path, { params: { "actionId": testActionModel._id } }).reply(200, {
      data: testActionModel
    }
    );
    const res = await _manageAction.getActionById(testActionModel._id);
    expect(res.name).toBe(testActionModel.name);
  });

 
  test("should return a list of actions after deletion", async () => {
    mock.onDelete(_manageAction.path).reply(200, { data: [] });
    const res = await _manageAction.deleteAction("Test Action id");
    expect(res).to.empty;
  });
 
  test("should return the updated action", async () => {
    testActionModel.name = "Updated Action Name";
    mock.onPut(_manageAction.path).reply(200, { data: testActionModel });
    const res: ActionModel = await _manageAction.updateAction(
      testActionModel._id,
      "Updated ActionName",
      testActionModel.description,
      testActionModel.serviceId,
      testActionModel.serviceId,
    );
    expect(res).not.toBe(null);
    expect(res.name).toEqual("Updated Action Name");
  });
});
