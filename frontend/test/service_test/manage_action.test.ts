import { StubbedInstance, stubInterface } from "ts-sinon";
import { beforeAll, describe, expect, test } from "vitest";
import IManageAction from "../../src/services/manage_action";
import ActionModel from "../../src/model/action_model";

describe("Manage Action Tests", () => {
  let manageActionStub: StubbedInstance<IManageAction>;
  let actionModel: ActionModel = new ActionModel(
    "Test Action id",
    "Test Action name",
    "Test Description",
    "Test Service name",
    "Test Service id",
  );

  beforeAll(() => {
    manageActionStub = stubInterface<IManageAction>();
  });


  
  test("Should return a list of actions", async () => {
    manageActionStub.getAllActions.resolves(
      [actionModel]
    );
    const res = await manageActionStub.getAllActions();
    expect(res).not.toBe(null);
    expect(res?.length).toBe(1);
    expect(res).toBeInstanceOf(Array<ActionModel>);
  });









 });
