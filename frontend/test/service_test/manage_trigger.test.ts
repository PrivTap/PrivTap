import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import {ManageTrigger} from "../../src/services/manage_trigger";
import TriggerModel from "../../src/model/trigger_model";
import MockAdapter from "axios-mock-adapter";
import PermissionModel from "../../src/model/permission_model";
import RarObjectModel from "../../src/model/rar_model";

// let RarObjectModel1: RarObjectModel = new RarObjectModel(
// "Type",
// ["String"],
// ["String"],
// );

// let PermissionModel1: PermissionModel = new PermissionModel(
//   "Permission id",
//   "Service id",
//   "Name",
//   "Description",
//   "Authorization details",
// );

 

describe("Manage Trigger Test", () => {
  let mock: MockAdapter;
  const _manageTrigger = ManageTrigger.getInstance;
  let testTriggerModel: TriggerModel = new TriggerModel(
    "Test Trigger id",
    "Test Trigger name",
    "Trigger description",
    ["String1", "String2"],
  );

  beforeAll(() => {
    mock = new MockAdapter(_manageTrigger.http);
  });


  beforeEach(() => {
    mock.reset();
  })


  //TEST CreateTrigger
  // test("Should return the created trigger", async () => {
  //   mock.onPost(_manageTrigger.path).reply(200, { data: testTriggerModel });
  //   const res = await _manageTrigger.createTrigger(
  //   testTriggerModel._id,
  //   testTriggerModel.name,
  //   testTriggerModel.serviceId,
  //   testTriggerModel.description,
  //   testTriggerModel.premission,
  //   );
  //   expect(res.name).toEqual(testTriggerModel.name);
  // });

  //TEST GetAllTriggers
  // test("Should return a list of defined triggers", async () => {
  //   mock.onGet(_manageTrigger.path).reply(200, { data: [testTriggerModel] });
  //   const res = await _manageTrigger.getAllTriggers();
  //   expect(res).toEqual([testTriggerModel]);
  // });

  //TEST GetTriggerById
  // test("Should return the trigger with the passed id", async () => {
  //   mock.onGet(_manageTrigger.path, { params: { "triggerId": testTriggerModel._id } }).reply(200, {
  //     data: testTriggerModel
  //   }
  //   );
  //   const res = await _manageTrigger.getTriggerById(testTriggerModel._id);
  //   expect(res.name).toBe(testTriggerModel.name);
  // });

  //TEST DeleteTrigger
  // test("Should return a list of triggers after delete", async () => {
  //   mock.onDelete(_manageTrigger.path).reply(200, { data: [] });
  //   const res = await _manageTrigger.deleteTrigger("Test Trigger id");
  //   expect(res).to.empty;
  // });

  //TEST UpdateTrigger
  test("Should return the updated trigger", async () => {
    testTriggerModel.name = "Updated Trigger Name";
    mock.onPut(_manageTrigger.path).reply(200, { data: testTriggerModel });
    const res: TriggerModel = await _manageTrigger.updateTrigger(
      testTriggerModel._id,
      "Updated Trigger name",
      testTriggerModel.description,
      testTriggerModel.permissions,
      testTriggerModel.resourceServer,  
    );
    expect(res).not.toBe(null);
    expect(res.name).toEqual("Updated Trigger Name");
  });

 });
