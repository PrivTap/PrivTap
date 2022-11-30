// import { StubbedInstance, stubInterface } from "ts-sinon";
import { beforeAll, beforeEach, describe, expect, Mock, test } from "vitest";
import { ManageRule } from "../../src/services/manage_rule";
import RuleModel from "../../src/model/rule_model";
import MockAdapter from "axios-mock-adapter";

describe("Manage Rule Tests", () => {
  // let manageRuleStub: StubbedInstance<IManageRule>;
  let mock: MockAdapter;
  const _manageRule = ManageRule.getInstance
  let testRuleModel: RuleModel = new RuleModel(
    "Test Rule id",
    "Test Ruele name",
    "Test User id",
    "Test Trigger id",
    "Test Action id",
    true,
  );

  // beforeAll(() => {
  //   manageRuleStub = stubInterface<IManageRule>();
  // });

  beforeAll(() => {
    mock = new MockAdapter(_manageRule.http);
  });

  beforeEach(() => {
    mock.reset();
  })


  /// Test createRule
  // test("Should return the created rule", async () => {
  //   manageRuleStub.createRule.resolves({
  //     status: true,
  //     message: "",
  //     data: ruleModel,
  //   });
  //   const res = await manageRuleStub.createRule(
  //     "Test Trigger id",
  //     "Test Action id",
  //   );
  //   expect(res.status).toBe(true);
  //   expect(res.message).to.empty;
  //   expect(res.data).toBeInstanceOf(RuleModel);
  // });

  //TEST CreateRule
  test("Should return the created rule", async () => {
    mock.onPost(_manageRule.path).reply(200, { data: testRuleModel });
    const res = await _manageRule.createRule(
      testRuleModel.triggerId,
      testRuleModel.actionId,
    );
    expect(res.name).toEqual(testRuleModel.name);
  });




  /// Test getAllRules
  // test("Should return a list of defined rules", async () => {
  //   manageRuleStub.getAllRules.resolves(
  //     [ruleModel]
  //   );
  //   const res = await manageRuleStub.getAllRules();
  //   expect(res).not.toBe(null);
  //   expect(res?.length).toBe(1);
  //   expect(res).toBeInstanceOf(Array<RuleModel>);
  // });

  //TEST GetAllRules
  test("Should return a list of defined rules", async () => {
    mock.onGet(_manageRule.path).reply(200, { data: [testRuleModel] });
    const res = await _manageRule.getAllRules();
    expect(res).toEqual([testRuleModel]);
  });



  /// Test deleteRules
  // test("Should return a list of rules after deletetion", async () => {
  //   manageRuleStub.deleteRule.resolves([]);
  //   const res = await manageRuleStub.deleteRule("Test Rule id");
  //   expect(res).to.empty;
  // });

  //TEST DeleteRule
  test("Should return a list of rules after deletetion", async () => {
    mock.onDelete(_manageRule.path).reply(200, { data: [] });
    const res = await _manageRule.deleteRule("Test Rule id");
    expect(res).to.empty;
  });


//TEST GetRuleById
test("Should return the rule with the passed id", async () => {
  mock.onGet(_manageRule.path, { params: { "ruleId": testRuleModel._id } }).reply(200, {
    data: testRuleModel
  }
  );
  const res = await _manageRule.getRuleById(testRuleModel._id);
  expect(res.name).toBe(testRuleModel.name);
});

});
