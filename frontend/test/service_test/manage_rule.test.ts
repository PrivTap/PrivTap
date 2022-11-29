import { StubbedInstance, stubInterface } from "ts-sinon";
import { beforeAll, describe, expect, test } from "vitest";
import IManageRule from "../../src/services/manage_rule";
import RuleModel from "../../src/model/rule_model";

describe("Manage Rule Tests", () => {
  let manageRuleStub: StubbedInstance<IManageRule>;
  let ruleModel: RuleModel = new RuleModel(
    "Test Rule id",
    "Test User id",
    "Test Trigger id",
    "Test Action id",
    true,
  );

  beforeAll(() => {
    manageRuleStub = stubInterface<IManageRule>();
  });

  /// Test createRule
  test("Should return the created rule", async () => {
    manageRuleStub.createRule.resolves({
      status: true,
      message: "",
      data: ruleModel,
    });
    const res = await manageRuleStub.createRule(
      "Test Trigger id",
      "Test Action id",
    );
    expect(res.status).toBe(true);
    expect(res.message).to.empty;
    expect(res.data).toBeInstanceOf(RuleModel);
  });





  /// Test getAllRules
  test("Should return a list of defined rules", async () => {
    manageRuleStub.getAllRules.resolves(
      [ruleModel]
    );
    const res = await manageRuleStub.getAllRules();
    expect(res).not.toBe(null);
    expect(res?.length).toBe(1);
    expect(res).toBeInstanceOf(Array<RuleModel>);
  });





  /// Test deleteRules
  test("Should return a list of rules after deletetion", async () => {
    manageRuleStub.deleteRule.resolves([]);
    const res = await manageRuleStub.deleteRule("Test Rule id");
    expect(res).to.empty;
  });



  //   test("Should return the updated rule", async () => {
  //     manageRuleStub.updateRule.resolves(
  //       ruleModel
  //     );
  //     const res = await manageRuleStub.updateRule(
  //     "Test Rule id",
  //     "Test User id",
  //     "Test Trigger id",
  //     "Test Action id",
  //     true,
  //     );
  //     expect(res).not.toBe(null);
  //     expect(res).toBeInstanceOf(RuleModel);
  //   });
});
