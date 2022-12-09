import type RuleModel from "@/model/rule_model";
import { ref, type Ref } from "vue";
import { GenericController } from "./generic_controller";

const path = "/manage-rules";
let rules = ref<RuleModel[]>([]);

export interface IManageRule {
  createRule(
    triggerId: string,
    actionId: string,
  ): Promise<void>;
  getRuleById(ruleId: string): Promise<RuleModel>;
  deleteRule(ruleId: string): Promise<void>;
  getAllRules(): Promise<void>;
}

class ManageRule extends GenericController<RuleModel[]> implements IManageRule {
  getRef(): Ref<RuleModel[]> {
    return rules;
  }

  async getAllRules(): Promise<void> {
    const res = await super.get<RuleModel[]>(path);
    rules.value = !!res ? res : [];
  }


  async getRuleById(ruleId: string): Promise<RuleModel> {
    const res = await super.get<RuleModel>(path, { query: { ruleId } });
    return res;
  }

  async createRule(
    triggerId: string,
    actionId: string,
  ): Promise<void> {
    const body = {
      triggerId: triggerId,
      actionId: actionId,
    };
    const res = await super.post<RuleModel>(path, { body: body, message: "Rule created" });
    rules.value.push(res);
  }

  async deleteRule(ruleId: string): Promise<void> {
    const body = { "ruleId": ruleId }
    await super.delete(path, { body: body, message: "Rule deleted" });
    rules.value = rules.value.filter((rule) => rule._id !== ruleId);
  }

}
export default new ManageRule();



