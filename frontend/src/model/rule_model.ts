// Build class for the rule

export default class RuleModel {
    _id: string;
    name: string;
    triggerId: string;
    actionId: string;
  
    constructor(
      ruleId: string,
      name: string,
      triggerId: string,
      actionId: string,
    ) {
      this._id = ruleId;
      this.name = name;
      this.triggerId = triggerId;
      this.actionId = actionId;
    }
  }