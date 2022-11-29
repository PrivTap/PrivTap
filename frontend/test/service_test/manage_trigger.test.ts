import { StubbedInstance, stubInterface } from "ts-sinon";
import { beforeAll, describe, expect, test } from "vitest";
import IManageTrigger from "../../src/services/manage_trigger";
import TriggerModel from "../../src/model/trigger_model";
 

 

describe("Manage Trigger Tests", () => {
  let manageTriggerStub: StubbedInstance<IManageTrigger>;
  let triggerModel: TriggerModel = new TriggerModel(
    "Test Trigger id",
    "Test Trigger name",
    "Test Service id",
    "Trigger description",
    ['Permission1', 'Permission2'],


  );

  beforeAll(() => {
    manageTriggerStub = stubInterface<IManageTrigger>();
  });


  
  test("Should return a list of triggers", async () => {
    manageTriggerStub.getAllTriggers.resolves(
      [triggerModel]
    );
    const res = await manageTriggerStub.getAllTriggers();
    expect(res).not.toBe(null);
    expect(res?.length).toBe(1);
    expect(res).toBeInstanceOf(Array<TriggerModel>);
  });









 });
