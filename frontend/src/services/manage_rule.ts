import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type RuleModel from "@/model/rule_model";
import type { AxiosInstance } from "axios";
import { ref } from "vue";
import { useToast } from "vue-toastification";

export default interface IManageRule {
  createRule(
    triggerId: string,
    actionId: string,
  ): Promise<RuleModel | null>;
  getRuleById(ruleId: string): Promise<RuleModel | null>;
  deleteRule(ruleId: string): Promise<RuleModel[] | null>;
  getAllRules(): Promise<RuleModel[] | null>;
}

export class ManageRule implements IManageRule {

  private static _instance: ManageRule;
  http: AxiosInstance;

  private constructor() {
    this.http = http();
  }

  static get getInstance(): ManageRule {
    if (!ManageRule._instance) {
      ManageRule._instance = new ManageRule();
    }
    return ManageRule._instance;
  }

  path: string = "/manage-rules";

  rules = ref<RuleModel[]>([]); 

  async getAllRules(): Promise<RuleModel[] | null> {
    try {
      const res = await this.http.get(this.path);
      this.rules.value = res.data.data as RuleModel[];
      return res.data.data;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }


  async getRuleById(ruleId: string): Promise<RuleModel | null> {
    try {
      const res = await this.http.get(this.path, { params: { ruleId } });
      return res.data.data as RuleModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async createRule(
    triggerId: string,
    actionId: string,
  ): Promise<RuleModel | null> {
    const body = {
      triggerId: triggerId,
      actionId: actionId,
    };
    try {
      const res = await this.http.post(this.path, body);
      useToast().success("Rule created");
      return res.data.data as RuleModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async deleteRule(ruleId: string): Promise<Array<RuleModel> | null> {
    try {
      const body = { "ruleId": ruleId }
      const res = await this.http.delete(this.path, { data: body });
      this.rules.value = this.rules.value.filter((rule) => rule._id !== ruleId);
      useToast().success("Rule deleted");
      return this.rules.value;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

}




