import type RuleModel from "@/model/rule_model";
import {ref, type Ref} from "vue";
import {GenericController} from "./generic_controller";

const path = "/manage-rules";
let rules = ref<RuleModel[]>([]);

export interface IManageRule {
    createRule(
        name: string,
        triggerId: string,
        actionId: string,
    ): Promise<void>;

    deleteRule(ruleId: string): Promise<void>;

    getAllRules(userId: string): Promise<void>;
}

class ManageRule extends GenericController<RuleModel[]> implements IManageRule {
    getRef(): Ref<RuleModel[]> {
        return rules;
    }

    async getAllRules(userId: string): Promise<void> {
        
        const res = await super.get<RuleModel[]>(path, { query: { userId }} );
        rules.value = !!res ? res : [];
    }

    async createRule(name: string,
                     triggerId: string,
                     actionId: string,
    ): Promise<void> {
        const body = {
            name: name,
            triggerId: triggerId,
            actionId: actionId,
        };
        const res = await super.post<RuleModel>(path, {body: body, message: "Rule created"});
        if (!!res)
            rules.value.push(res);
    }

    async deleteRule(ruleId: string): Promise<void> {
        const body = {"ruleId": ruleId}
        await super.delete(path, {body: body, message: "Rule deleted"});
        rules.value = rules.value.filter((rule) => rule._id !== ruleId);
    }
}

export default new ManageRule();



