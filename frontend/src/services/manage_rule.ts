import axiosCatch from "@/helpers/axios_catch";
import type RuleModel from "@/model/rule_model";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import IAxiosService from "../helpers/axios_service";

export default interface IManageRule extends IAxiosService {
  createRule(
    triggerId: string,
    actionId: string,
    // Does anything else gets filled up from backend here ?
    //Test 
  ): Promise<RuleModel | null>;
  getRuleById(ruleId: string): Promise<RuleModel | null>;
  // updateRule(ruleId: string,
  //   userId: string,
  //   triggerId: string,
  //   actionId: string,
  //   isAuthorized: boolean
  //   ): Promise<RuleModel | null>;
  deleteRule(ruleId: string): Promise<RuleModel[] | null>;
  getAllRules(): Promise<RuleModel[] | null>;
}

export class ManageRule extends IAxiosService implements IManageRule {

private static _instance: ManageRule;

private constructor(){
  super();
}

  // deleteRule(ruleId: string): Promise<RuleModel[] | null> {
  //   throw new Error("Method not implemented.");
  // }

public static getInstance(): ManageRule {
  if(!ManageRule._instance) {
    ManageRule._instance = new ManageRule();
  }
  return ManageRule._instance;
}

path: string = "/manage-rules";

rules = ref<RuleModel[]>([]); //What did I make here

async getAllRules(): Promise<RuleModel[] | null> {
    try{
      const res = await this.http.get(this.path);
      this.rules.value = res.data.data as RuleModel[]; 
      return res.data.data;
    }catch (error) {
      axiosCatch(error);
      return null;
    }
}


async getRuleById(ruleId: string): Promise<RuleModel | null> {
    try{
      const res = await this.http.get(this.path, {params: { ruleId } });
      return res.data.data[0] as RuleModel;
    }catch (error){
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
    try{
      console.log(body);
      const res = await this.http.post(this.path, body);
      useToast().success("Rule created");
      return res.data.data as RuleModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
}


// async updateRule(ruleId: string, 
//   userId: string, 
//   triggerId: string, 
//   actionId: string, 
//   isAuthorized: boolean
//   ): Promise<RuleModel | null> {
//     try {
//       const body = {
//         userId: userId,
//         triggerId: triggerId,
//         actionId: actionId,
//         isAuthorized: isAuthorized,
//       }
//       console.log(body);
//       const res = await this.http.put(this.path, body);
//       useToast().success("Rule updated");
//       return res.data.data as RuleModel;
//     } catch (error){
//       axiosCatch(error);
//       return null;
//     }
// }

async deleteRule(ruleId: string): Promise<Array<RuleModel> | null> {
  try {
    const body = {"ruleId": ruleId}
    const res = await this.http.delete(this.path, {data: body});
    this.rules.value = this.rules.value.filter((rule) => rule._id !== ruleId);
    useToast().success("Rule deleted");
    return this.rules.value;
  }catch (error) {
    axiosCatch(error);
    return null;
  }
}

}




