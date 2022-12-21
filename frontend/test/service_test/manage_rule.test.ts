import { afterEach, beforeEach, describe, test } from "vitest";
import { SinonStub } from "sinon";
import * as sinon from "sinon";
import { use, expect } from "chai";
import RuleModel from "../../src/model/Rule_model";
import axiosInstance from "../../src/helpers/axios_service";
import sinonChai from "sinon-chai";
import manageRule from "../../src/controllers/rules_controller";


use(sinonChai);

const sandbox = sinon.createSandbox();

describe("Manage Rule Test", () => {
  let getStub: SinonStub;
  let postStub: SinonStub;
  let putStub: SinonStub;
  let deleteStub: SinonStub;

  const testRuleModel: RuleModel = new RuleModel(
    "Test Rule id",
    "Test Rule name",
    "triggerId",
    "actionId",
    true
  );
  beforeEach(() => {
    getStub = sandbox.stub(axiosInstance, "get");
    postStub = sandbox.stub(axiosInstance, "post");
    putStub = sandbox.stub(axiosInstance, "put");
    deleteStub = sandbox.stub(axiosInstance, "delete");
  });
  afterEach(async () => {
    sandbox.restore();
    manageRule.getRef().value = []
  })

  //TEST GetRules
  test("Should put in the ref all the Rules", async () => {
    getStub.resolves({ data: { data: [testRuleModel] } })
    await manageRule.getAllRules();
    expect(manageRule.getRef().value).to.be.eql([testRuleModel]);
  });
  test("Should put nothing in the ref value if the gets failed", async () => {
    getStub.resolves(null);
    await manageRule.getAllRules();
    expect(manageRule.getRef().value).to.be.eql([]);
  })
  //TEST CreateRules
  test("Should put the created Rule in the ref array", async () => {
    postStub.resolves({ data: { data: testRuleModel } })
    await manageRule.createRule(testRuleModel.name, testRuleModel.triggerId,
      testRuleModel.actionId)
    expect(manageRule.getRef().value).to.be.eql([testRuleModel]);
  });
  test("Should put nothing in the ref value if the gets failed", async () => {
    postStub.resolves(null);
    await manageRule.createRule(testRuleModel.name, testRuleModel.triggerId,
      testRuleModel.actionId)
    expect(manageRule.getRef().value).to.be.eql([]);
  })

  //TEST DeleteRule
  test("Should delete the Rule in the ref value", async () => {
    manageRule.getRef().value = [testRuleModel];
    await manageRule.deleteRule(testRuleModel._id);
    expect(manageRule.getRef().value).to.be.eql([]);
  });

});
