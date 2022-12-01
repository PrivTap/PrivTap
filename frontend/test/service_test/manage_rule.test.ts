import { beforeAll, beforeEach, describe, expect, Mock, test } from "vitest";
import { ManageRule } from "../../src/services/manage_rule";
import RuleModel from "../../src/model/rule_model";
import MockAdapter from "axios-mock-adapter";

describe("Manage Rule Tests", () => {
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

  beforeAll(() => {
    mock = new MockAdapter(_manageRule.http);
  });

  beforeEach(() => {
    mock.reset();
  })

  //TEST CreateRule
  test("Should return the created rule", async () => {
    mock.onPost(_manageRule.path).reply(200, { data: testRuleModel });
    const res = await _manageRule.createRule(
      testRuleModel.triggerId,
      testRuleModel.actionId,
    );
    expect(res.name).toEqual(testRuleModel.name);
  });

  //TEST GetAllRules
  test("Should return a list of defined rules", async () => {
    mock.onGet(_manageRule.path).reply(200, { data: [testRuleModel] });
    const res = await _manageRule.getAllRules();
    expect(res).toEqual([testRuleModel]);
  });

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
